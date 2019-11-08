import { InvalidOperationException, NotImplementedException, InvalidTypeException } from "./exceptions.js";
import { Closure, Shell } from "./Standard.Closures.js";

const allDestructibles = [];

class DestructibleClosure extends Closure {
    initialize() {
        super.initialize();

        allDestructibles.push(this.shell);
    }

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

export class Destructible extends Shell {
    constructor() {
        super(DestructibleClosure);

        if (this.constructor === Destructible)
            throw new InvalidOperationException("Invalid constructor.");
    }

    destruct() {
        Closure.doIfExists(this, c => c.destruct());
    }

    get isDestructed() {
        return Closure.doIfExists(this, c => c.isDestructed);
    }
}

function beforeUnload() {
    window.removeEventListener("beforeunload", beforeUnload);

    for (let destructible of allDestructibles) {
        if (!destructible.isDestructed)
            destructible.destruct();
    }
}

window.addEventListener("beforeunload", beforeUnload);