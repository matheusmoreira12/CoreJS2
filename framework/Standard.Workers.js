import { ArgumentException, InvalidOperationException, NotFoundException } from "./exceptions.js";
import { Type } from "./Standard.Types.js";
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
            const name = decapitalizeFirst(matches.groups["name"]);
            return new WorkerGetter(name);
        }

        throw new FormatException(`"get"GetterName`, value);
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
            const name = transformWorkerMethodName(matches.groups["name"]);
            return new WorkerSetter(name);
        }

        throw new FormatException(`"set"SetterName`, value);
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
            const name = transformWorkerMethodName(matches.groups["name"]);
            return new WorkerAction(name);
        }

        throw new FormatException(`"do"ActionName`, value);
    }
}

function* getWorkerMethods(worker) {
    for (let name of Object.getOwnPropertyNames(worker)) {
        let tryParseData = {};

        if (WorkerMethod.tryParse(name, tryParseData))
            yield tryParseData.result;
    }
}

function applyWorkerMethods(methods, self, worker) {
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

        const name = (getter || setter).name;

        const workerGetterName = "get" + capitalizeFirst(name),
            workerSetterName = "set" + capitalizeFirst(name);

        Object.defineProperty(self, name, {
            get: hasGetter ? worker[workerGetterName].bind(worker) : null,
            set: hasSetter ? worker[workerSetterName].bind(worker) : null
        });
    }

    function applyAction(action) {
        const workerName = "do" + capitalizeFirst(action.name);

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
        applyWorkerMethods(getWorkerMethods(this), this.self, this);
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

    let worker = new workerClass(self, ...args);
    worker.initialize(...args);

    workerMap.set(self, worker);
}