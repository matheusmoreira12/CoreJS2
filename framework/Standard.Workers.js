import { ArgumentException, InvalidOperationException, NotFoundException, KeyNotFoundException, ArgumentNullException } from "./exceptions.js";
import { Type, MemberSelectionType } from "./Standard.Types.js";
import { Enumeration } from "./Standard.Enumeration.js";
import { TokenReader } from "./Standard.Tokens.js";
import { Collection } from "./Standard.Collections.js";

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
        createWorker(self, workerClass, ...args);
    }

    static override(self, workerClass, ...args) {
        overrideWorker(self, workerClass, ...args);
    }

    static retrieve(self, workerClass) {
        return getWorker(self, workerClass);
    }

    static delete(self, workerClass) {
        deleteWorker(self, workerClass);
    }

    constructor(self) {
        this.self = self;
    }

    initialize() {
        applyWorkerMethods(this.self, this, ...getWorkerMethods(this));
    }

    finalize() { }
}

const workers = new Collection();

function getWorker(self, workerClass) {
    if (!self === null || self === undefined)
        throw ArgumentNullException("self");
    if (workerClass === null || workerClass === undefined)
        throw ArgumentNullException("workerClass");
    if (!Type.get(workerClass).extends(Type.get(Worker)))
        throw new ArgumentException("workerClass", "The specified value must be a class extending the Worker class.");

    const worker = workers.find(w => w.self === self && Type.get(workerClass).equalsOrExtends(Type.of(w)));
    if (worker === undefined)
        throw new KeyNotFoundException("No created or overridden worker was found for the specified self and worker class.");

    return worker;
}

function createWorker(self, workerClass, ...args) {
    if (!Type.get(workerClass).extends(Type.get(Worker)))
        throw new ArgumentException("workerClass", "The specified value must be a class extending the Worker class.");

    const worker = new workerClass(self);
    workers.add(worker);

    worker.initialize(...args);

    return worker;
}

function deleteWorker(self, workerClass) {
    let worker = getWorker(self, workerClass);
    worker.finalize();
}

function overrideWorker(self, workerClass, ...args) {
    let oldWorker = getWorker(self);
    if (!Type.get(workerClass).extends(Type.of(oldWorker)))
        throw new InvalidOperationException("Cannot override worker. The new worker class must extend a worker class already in use.");

    deleteWorker(self, workerClass);

    createWorker(self, workerClass);
}