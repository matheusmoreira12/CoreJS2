import { ArgumentException, InvalidOperationException, NotFoundException } from "./exceptions.js";
import { Type, MemberSelectionType } from "./Standard.Types.js";
import { Enumeration } from "./Standard.Enumeration.js";

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
        if (typeof value !== "string")
            throw new ArgumentTypeException("value", Type.of(value), Type.get(String));

        let tryParseData = {};

        if (WorkerGetter.tryParse(value, tryParseData) ||
            WorkerSetter.tryParse(value, tryParseData) ||
            WorkerAction.tryParse(value, tryParseData))
            return tryParseData.result;

        throw new FormatException(`"${WORKER_GETTER_PREFIX}"[Gg]etterName | "${WORKER_SETTER_PREFIX}"[Ss]etterName | "${WORKER_ACTION_PREFIX}"[Aa]ctionName`, value);
    }

    static tryParse(value, tryParseData) {
        try {
            tryParseData.result = this.parse(value);
            return true;
        }
        catch (e) {
            tryParseData.error = e;
            return false;
        }
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

        throw new FormatException(`"get"[Gg]etterName`, value);
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

        throw new FormatException(`"set"[Ss]etterName`, value);
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

        throw new FormatException(`"do"[Aa]ctionName`, value);
    }
}

function* getWorkerMethods(worker) {
    let functionMembers = Type.of(worker).getMembers(MemberSelectionType.Function);

    for (let functionMember of functionMembers) {
        let tryParseData = {};

        if (WorkerMethod.tryParse(functionMember.name, tryParseData))
            yield tryParseData.result;
    }
}

function applyWorkerMethods(self, worker, ...methods) {
    let appliedNames = [];

    function getSetterByName(name) {
        return methods.find(m => m.type === WorkerMethodType.Setter && m.name === name);
    }

    function getGetterByName(name) {
        return methods.find(m => m.type === WorkerMethodType.Setter && m.name === name);
    }

    function applyGetterAndSetter(getter, setter) {
        const hasGetter = !!getter,
            hasSetter = !!setter;

        const name = (getter || setter).name,
            workerGetterName = WORKER_GETTER_PREFIX + name,
            workerSetterName = WORKER_SETTER_PREFIX + name;

        const propertyDescriptor = {};
        if (hasGetter)
            propertyDescriptor.get = worker[workerGetterName].bind(worker);
        if (hasSetter)
            propertyDescriptor.set = worker[workerSetterName].bind(worker);

        Object.defineProperty(self, name, propertyDescriptor);
    }

    function applyAction(action) {
        const workerName = WORKER_ACTION_PREFIX + action.name;

        self[action.name] = worker[workerName].bind(worker);
    }

    for (let method of methods) {
        if (appliedNames.includes(method.name)) continue;

        switch (method.type) {
            case WorkerMethodType.Getter:
                let setter = getSetterByName(method.name);
                applyGetterAndSetter(method, setter);
                break;

            case WorkerMethodType.Setter:
                let getter = getGetterByName(method.name);
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