import { ArgumentException, InvalidOperationException, NotFoundException } from "./exceptions.js";
import { Type } from "./Standard.Types.js";

export class Worker {
    static create(target, workerClass, ...args) {
        if (workerMap.has(target)) throw new InvalidOperationException("A Worker for the specified Object has already been created. If an override is intended, use the function Worker.override(target, workerClass, [argument, ...]) instead.");

        createWorker(target, workerClass, ...args);
    }

    static override(target, workerClass, ...args) {
        if (!workerMap.has(target)) throw new InvalidOperationException("No Worker has been created for the specified Object. If a creation is intended, use the function Worker.create(target, workerClass, [argument, ...]) instead.");

        createWorker(target, workerClass, ...args);
    }

    static retrieve(target, workerClass) {
        if (!Type.get(workerClass).equalsOrExtends(Type.get(worker.constructor)))
            throw new InvalidOperationException("Cannot retrieve Worker. Ownership must be proved by providing the original Worker class, or a class extending it.");

        let worker = workerMap.get(target);
        if (!worker) return undefined;

        return worker;
    }

    static delete(target, workerClass) {
        if (!Type.get(workerClass).equalsOrExtends(Type.get(worker.constructor)))
            throw new InvalidOperationException("Cannot retrieve Worker. Ownership must be proved by providing the original Worker class, or a class extending it.");

        let worker = workerMap.get(target);
        if (!worker)
            throw new NotFoundException("A Worker for the specified target has not been found.");

        worker.finalize();

        workerMap.delete(target);
    }

    constructor(target) {
        this.target = target;
    }

    initialize() { }

    finalize() {
        for (let key in this) delete this[key];
    }
}

const workerMap = new WeakMap();

function createWorker(target, workerClass, ...args) {
    if (!Type.get(workerClass).extends(Type.get(Worker))) throw new ArgumentException("workerClass", "The specified value must be a class extending the Worker class.");

    let worker = new workerClass(target, ...args);
    worker.initialize(...args);

    workerMap.set(target, worker);
}