import { InvalidOperationException, NotImplementedException } from "./exceptions.js";

let workerMap = new WeakMap();

class DestructibleWorker {
    constructor(destructible) {
        this.destructible = destructible;
    }

    destruct() {
        if (this.isDestructed)
            throw new InvalidOperationException("Object has already been destructed.");

        this.destructible.destructor();

        this.isDestructed = true;
    }

    isDestructed = false;
}

function createDestructibleWorker(destructible) {
    let worker = new DestructibleWorker(destructible);

    workerMap.set(destructible, worker);
}

export class Destructible {
    constructor() {
        if (this.constructor === Destructible)
            throw new InvalidOperationException("Invalid constructor.");

        createDestructibleWorker(this);
    }

    destructor() {
        throw new NotImplementedException("Destructor has not been implemented.");
    }

    destruct() {
        let worker = workerMap.get(this);
        if (!worker) return;

        worker.destruct();
    }

    get isDestructed() {
        let worker = workerMap.get(this);
        if (!worker) return undefined;

        return worker.isDestructed;
    }
}