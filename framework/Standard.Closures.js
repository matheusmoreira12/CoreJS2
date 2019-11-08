import { ArgumentTypeException, FormatException } from "./exceptions.js";
import { Type } from "./Standard.Types.js";
import { Enumeration } from "./Standard.Enumeration.js";

let closureMap = new WeakMap();

export class Closure {
    static getFor(shell) {
        if (!(shell instanceof Shell))
            throw new ArgumentTypeException("shell");

        return closureMap.get(shell);
    }

    static doIfExists(shell, predicate) {
        if (!(predicate instanceof Function))
            throw new ArgumentTypeException("predicate");

        let closure = this.getFor(shell);
        if (!closure) return undefined;

        return predicate(closure);
    }

    constructor(shell) {
        this.shell = shell;
    }

    initialize(...args) { }
}

export class Shell {
    constructor(closureClass, ...args) {
        let closure = new closureClass(this);
        closure.initialize(...args);

        closureMap.set(this, closure);
    }
}