import { ArgumentException, InvalidOperationException, NotFoundException } from "./exceptions.js";
import { Type, MemberSelectionType } from "./Standard.Types.js";
import { Enumeration } from "./Standard.Enumeration.js";
import { TokenReader } from "./Standard.Tokens.js";

const WORKER_GETTER_PREFIX = "get_";
const WORKER_SETTER_PREFIX = "set_";
const WORKER_ACTION_PREFIX = "do_";

const IDENTIFIER_PATTERN = "[A-Za-z_$]\\w*";

const WORKER_GETTER_NAME_PATTERN = `^${WORKER_GETTER_PREFIX}(?<name>${IDENTIFIER_PATTERN})$`;
const WORKER_SETTER_NAME_PATTERN = `^${WORKER_SETTER_PREFIX}(?<name>${IDENTIFIER_PATTERN})$`;
const WORKER_ACTION_NAME_PATTERN = `^${WORKER_ACTION_PREFIX}(?<name>${IDENTIFIER_PATTERN})$`;

const WorkerMethodType = new Enumeration([
    "Getter",
    "Setter",
    "Action"
]);

class WorkerMethod {
    static parse(value) {
        return WorkerGetter.parse(value) || WorkerSetter.parse(value) || WorkerAction.parse(value);
    }

    constructor(name, type) {
        this.name = name;
        this.type = type;
    }
}

class WorkerGetter extends WorkerMethod {
    constructor(name) {
        super(name, WorkerMethodType.Getter);
    }

    static parse(value) {
        if (typeof value !== "string")
            throw new ArgumentTypeException("value", Type.of(value), Type.get(String));

        const matches = new RegExp(WORKER_GETTER_NAME_PATTERN).exec(value);
        if (matches) {
            const name = matches.groups["name"];
            return new WorkerGetter(name);
        }

        return null;
    }
}

class WorkerSetter extends WorkerMethod {
    constructor(name) {
        super(name, WorkerMethodType.Setter);
    }

    static parse(value) {
        if (typeof value !== "string")
            throw new ArgumentTypeException("value", Type.of(value), Type.get(String));

        const matches = new RegExp(WORKER_SETTER_NAME_PATTERN).exec(value);
        if (matches) {
            const name = matches.groups["name"];
            return new WorkerSetter(name);
        }

        return null;
    }
}

class WorkerAction extends WorkerMethod {
    constructor(name) {
        super(name, WorkerMethodType.Action);
    }

    static parse(value) {
        if (typeof value !== "string")
            throw new ArgumentTypeException("value", Type.of(value), Type.get(String));

        const matches = new RegExp(WORKER_ACTION_NAME_PATTERN).exec(value);
        if (matches) {
            const name = matches.groups["name"];
            return new WorkerAction(name);
        }

        return null;
    }
}

function* getWorkerMethods(worker) {
    let functionMembers = Type.of(worker).getMembers(MemberSelectionType.Function);

    for (let functionMember of functionMembers) {
        let method = WorkerMethod.parse(functionMember.name);

        if (method !== null)
            yield method;
    }
}

function applyWorkerMethods(self, worker, ...methods) {
    let reader = new TokenReader(methods);

    function findSetter(name) {
        let context = reader.derive();
        while (context.isWithinBounds) {
            let method = context.currentToken;
            context.increment();

            if (method.type === WorkerMethodType.Setter && method.name === name)
                return method;
        }

        return null;
    }

    function findGetter(name) {
        let context = reader.derive();
        while (context.isWithinBounds) {
            let method = context.currentToken;
            context.decrement();

            if (method.type === WorkerMethodType.Getter && method.name === name)
                return method;
        }

        return null;
    }

    function applyGetterAndSetter(getter, setter) {
        const hasGetter = !!getter,
            hasSetter = !!setter;

        const name = (getter || setter).name,
            workerGetterName = WORKER_GETTER_PREFIX + name,
            workerSetterName = WORKER_SETTER_PREFIX + name;

        const attributes = {};
        if (hasGetter)
            attributes.get = worker[workerGetterName].bind(worker);
        if (hasSetter)
            attributes.set = worker[workerSetterName].bind(worker);

        Object.defineProperty(self, name, attributes);
    }

    function applyAction(action) {
        const workerName = WORKER_ACTION_PREFIX + action.name;

        self[action.name] = worker[workerName].bind(worker);
    }

    let appliedNames = [];

    while (reader.isWithinBounds) {
        const method = reader.currentToken;
        reader.increment();

        if (appliedNames.includes(method.name)) continue;

        switch (method.type) {
            case WorkerMethodType.Getter:
                let setter = findSetter(method.name);
                applyGetterAndSetter(method, setter);
                break;

            case WorkerMethodType.Setter:
                let getter = findGetter(method.name);
                applyGetterAndSetter(getter, method);
                break;

            case WorkerMethodType.Action:
                applyAction(method);
                break;
        }

        appliedNames.push(method.name);
    }
}

export class Worker {
    static create(self, workerClass, ...args) {
        if (workerMap.has(self)) throw new InvalidOperationException("A Worker for the specified Object has already been created. If an override is intended, use the function Worker.override(self, workerClass, [argument, ...]) instead.");

        createWorker(self, workerClass, ...args);
    }

    static override(self, workerClass, ...args) {
        if (!workerMap.has(self)) throw new InvalidOperationException("No Worker has been created for the specified Object. If a creation is intended, use the function Worker.create(self, workerClass, [argument, ...]) instead.");

        createWorker(self, workerClass, ...args);
    }

    static retrieve(self, workerClass) {
        const worker = getWorker(self);
        if (!Type.get(workerClass).equalsOrExtends(Type.get(worker.constructor)))
            throw new InvalidOperationException("Cannot retrieve Worker. Ownership must be proved by providing the original Worker class, or a class extending it.");

        return worker;
    }

    static delete(self) {
        const worker = getWorker(self);
        worker.finalize();

        workerMap.delete(self);
    }

    constructor(self) {
        this.self = self;
    }

    initialize() {
        applyWorkerMethods(this.self, this, ...getWorkerMethods(this));
    }

    finalize() { }
}

const workerMap = new WeakMap();

function getWorker(self) {
    let worker = workerMap.get(self);
    if (!worker)
        throw new NotFoundException("A Worker for the specified self has not been found.");

    return worker;
}

function createWorker(self, workerClass, ...args) {
    if (!Type.get(workerClass).extends(Type.get(Worker))) throw new ArgumentException("workerClass", "The specified value must be a class extending the Worker class.");

    let worker = new workerClass(self);
    worker.initialize(...args);

    workerMap.set(self, worker);
}