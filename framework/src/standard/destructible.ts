import { ObjectUtils } from "../core-base/utils/index.js";
import { assert } from "../validation-standalone/index.js";
import { InvalidOperationException } from "./exceptions/index.js";

const aliveDestructibles: Set<Destructible> = new Set();

export abstract class Destructible {
    constructor() {
        if (new.target === Destructible)
            throw new InvalidOperationException("Invalid constructor.");

        aliveDestructibles.add(this);
    }

    protected _destructor(): void { }
}

function destructAlive() {
    for (let destructible of aliveDestructibles)
        callDestructorsRecursively(destructible);

    for (let destructible of aliveDestructibles)
        destructProperties(destructible);

    aliveDestructibles.clear();

    function callDestructorsRecursively(destructible: Destructible) {
        for (let proto of ObjectUtils.getPrototypeTree(destructible)) {
            if (proto instanceof Destructible) {
                assert({ "self._destructor": destructible["_destructor"] }, [Function]);
                proto["_destructor"].call(destructible);
            }
        }
    }

    function destructProperties(destructible: Destructible) {
        for (let prop of ObjectUtils.getAllPropertyKeys(destructible)) {
            Reflect.deleteProperty(destructible, prop);
        }
    }
}

window.addEventListener("beforeunload", window_beforeunload);

function window_beforeunload() {
    window.removeEventListener("beforeunload", window_beforeunload);
    destructAlive();
}