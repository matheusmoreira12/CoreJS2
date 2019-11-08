import { InvalidOperationException, NotImplementedException, InvalidTypeException } from "./exceptions.js";
import { Closure, Shell } from "./Standard.Closures.js";

let workerMap = new WeakMap();

class DestructibleClosure extends Closure {
    destruct() {
        if (!this.shell.destructor)
            throw new NotImplementedException("Destructor has not been implemented.");
        if (!(this.shell.destructor instanceof Function))
            throw new InvalidTypeException("this.destructor");

        if (this.isDestructed)
            throw new InvalidOperationException("Object has already been destructed.");

        this.shell.destructor();

        this.isDestructed = true;
    }

    isDestructed = false;
}

function createDestructibleWorker(destructible) {
    let worker = new DestructibleWorker(destructible);

    workerMap.set(destructible, worker);
}

export class Destructible extends Shell {
    constructor() {
        super(DestructibleClosure);

        if (this.constructor === Destructible)
            throw new InvalidOperationException("Invalid constructor.");

        createDestructibleWorker(this);
    }

    destruct() {
        Closure.doIfExists(c => c.destruct());
    }

    get isDestructed() {
        return Closure.doIfExists(c => c.isDestructed);
    }
}