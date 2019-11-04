import { ArgumentTypeException, FormatException } from "./exceptions.js";
import { Type } from "./Standard.Types.js";

let closureMap = new WeakMap();

const CLOSURE_GETTER_NAME_REGEX = /^get(?<name>[A-Z]\w*)$/;
const CLOSURE_SETTER_NAME_REGEX = /^set(?<name>[A-Z]\w*)$/;
const CLOSURE_ACTION_NAME_REGEX = /^do(?<name>[A-Z]\w*)$/;

class ClosureMethod {
    static parse(value) {
        if (typeof value !== "string")
            throw new ArgumentTypeException("value", Type.of(value), Type.get(String));

        let tryParseData = {};

        if (ClosureGetter.tryParse(value, tryParseData) ||
            ClosureSetter.tryParse(value, tryParseData) ||
            ClosureAction.tryParse(value, tryParseData))
            return tryParseData.result;

        throw new FormatException(`"get"GetterName | "set"SetterName | "do"ActionName`, value);
    }

    static tryParse(value, tryParseData) {
        try {
            tryParseData.result = this.parse(value);
            return true;
        }
        catch (e) {
            tryParseData.error = e;
            return false;
        }
    }

    constructor(name) {
        this.name = name;
        this.shell = shell;
        this.closure = closure;
    }
}

function transformClosureMethodName(original) {
    return original.replace(/^[A-Z]/, s => s.toLowerCase());
}

class ClosureGetter extends ClosureMethod {
    static parse(value) {
        if (typeof value !== "string")
            throw new ArgumentTypeException("value", Type.of(value), Type.get(String));

        const matches = CLOSURE_GETTER_NAME_REGEX.exec(value);
        if (matches) {
            const name = transformClosureMethodName(matches.groups["name"]);
            return new ClosureGetter(name);
        }

        throw new FormatException(`"get"GetterName`, value);
    }
}

class ClosureSetter extends ClosureMethod {
    static parse(value) {
        if (typeof value !== "string")
            throw new ArgumentTypeException("value", Type.of(value), Type.get(String));

        const matches = CLOSURE_SETTER_NAME_REGEX.exec(value);
        if (matches) {
            const name = transformClosureMethodName(matches.groups["name"]);
            return new ClosureSetter(name);
        }

        throw new FormatException(`"set"SetterName`, value);
    }
}

class ClosureAction extends ClosureMethod {
    static parse(value) {
        if (typeof value !== "string")
            throw new ArgumentTypeException("value", Type.of(value), Type.get(String));

        const matches = CLOSURE_ACTION_NAME_REGEX.exec(value);
        if (matches) {
            const name = transformClosureMethodName(matches.groups["name"]);
            return new ClosureAction(name);
        }

        throw new FormatException(`"do"ActionName`, value);
    }
}

function* getClosureMethods(closure) {
    for (let name of Object.getOwnPropertyNames(closure)) {
        let tryParseData = {};

        if (ClosureMethod.tryParse(name, tryParseData))
            yield tryParseData.result;
    }
}

function applyClosureMethods(methods, shell, closure) {

}

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