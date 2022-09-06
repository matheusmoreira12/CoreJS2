import { ObjectUtils } from "../core-base/utils/index.js";
import { InvalidOperationException } from "./exceptions/index.js";

const allDestructibles: Destructible[] = [];

export abstract class Destructible {
    constructor() {
        if (new.target === Destructible)
            throw new InvalidOperationException("Invalid constructor.");

        allDestructibles.push(this);
    }

    protected abstract destructor(): void;

    destruct() {
        if (this.__isDestructed)
            throw new InvalidOperationException("Object has already been destructed.");

        callDestructorsRecursively(this);
        destructAllDestructibleProperties(this);

        this.__isDestructed = true;
    }

    get isDestructed(): boolean { return this.__isDestructed; }
    private __isDestructed: boolean = false;
}

function callDestructorsRecursively(self: Destructible) {
    while (self) {
        const proto = Object.getPrototypeOf(self);
        if (proto instanceof Destructible)
            proto["destructor"].call(self);
        self = proto;
    }
}

function destructAllDestructibleProperties(self: Destructible) {
    for (let prop of ObjectUtils.getOwnPropertyKeys(self)) {
        const value = self[prop];
        if (value instanceof Destructible) {
            if (!value.isDestructed)
                value.destruct();
        }
    }
}

window.addEventListener("beforeunload", window_beforeunload);

function window_beforeunload() {
    window.removeEventListener("beforeunload", window_beforeunload);

    for (let destructible of allDestructibles) {
        if (!destructible.isDestructed)
            destructible.destruct();
    }
}

window.allDestructibles = allDestructibles;