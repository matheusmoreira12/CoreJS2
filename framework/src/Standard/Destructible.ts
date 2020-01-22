import { InvalidOperationException } from "./Exceptions.js";

const allDestructibles: Destructible[] = [];

export abstract class Destructible {
    constructor() {
        if (new.target === Destructible)
            throw new InvalidOperationException("Invalid constructor.");
    }

    protected abstract destructor(): void;

    destruct() {
        if (this.__isDestructed)
            throw new InvalidOperationException("Object has already been destructed.");

        this.destructor();

        this.__isDestructed = true;
    }

    get isDestructed(): boolean { return this.__isDestructed; }
    private __isDestructed: boolean = false;
}

function beforeUnload() {
    window.removeEventListener("beforeunload", beforeUnload);

    for (let destructible of allDestructibles) {
        if (!destructible.isDestructed)
            destructible.destruct();
    }
}
window.addEventListener("beforeunload", beforeUnload);