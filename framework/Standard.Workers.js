import { ArgumentException, InvalidOperationException } from "./exceptions.js";
import { Type } from "./Standard.Types.js";

export class Worker {
    constructor(target) {
        this.target = target;
    }

    initialize() { }

    finalize() {
        for (let key in this) delete this[key];
    }
}

const workerMap = new WeakMap();

function _createWorker(target, workerClass, ...args) {
    if (!Type.get(workerClass).extends(Type.get(Worker))) throw new ArgumentException("workerClass", "The specified value" +
        " must be a class extending the Worker class.");

    let worker = new workerClass(target, ...args);
    worker.initialize(...args);

    workerMap.set(target, worker);
}

export function createWorker(target, workerClass, ...args) {
    if (workerMap.has(target)) throw new InvalidOperationException("A Worker for the specified Object has already been" +
        " created. If an override is intended, use the function overrideWorker(target, workerClass, [arg, ...]) instead.");

    _createWorker(target, workerClass, ...args);
}

export function overrideWorker(target, workerClass, ...args) {
    if (!workerMap.has(target)) throw new InvalidOperationException("No Worker has been created for the specified Object." +
        " If a creation is intended, use the function createWorker(target, workerClass, [arg, ...]) instead.");

    _createWorker(target, workerClass, ...args);
}

export function retrieveWorker(target, workerClass) {
    let worker = workerMap.get(target);
    if (!worker) return undefined;

    if (!Type.get(workerClass).equals(Type.get(worker.constructor)) &&
        !Type.get(worker.constructor).extends(Type.get(workerClass))) throw new InvalidOperationException("Cannot" +
            "retrieve Worker. The original Worker class, or a class extending the original Worker class must be provided.");

    return worker;
}

export function deleteWorker(target) {
    let worker = workerMap.get(target);

    worker.finalize();

    workerMap.delete(target);
}