import { InvalidOperationException } from "./Exceptions";
const allDestructibles = [];
export class Destructible {
    constructor() {
        this.__isDestructed = false;
        if (new.target === Destructible)
            throw new InvalidOperationException("Invalid constructor.");
    }
    destruct() {
        if (this.isDestructed)
            throw new InvalidOperationException("Object has already been destructed.");
        this.destructor();
        this.__isDestructed = true;
    }
    get isDestructed() { return this.__isDestructed; }
}
function beforeUnload() {
    window.removeEventListener("beforeunload", beforeUnload);
    for (let destructible of allDestructibles) {
        if (!destructible.isDestructed)
            destructible.destruct();
    }
}
window.addEventListener("beforeunload", beforeUnload);
