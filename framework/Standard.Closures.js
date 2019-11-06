import { ArgumentTypeException, FormatException } from "./exceptions.js";
import { Type } from "./Standard.Types.js";
import { Enumeration } from "./Standard.Enumeration.js";

let closureMap = new WeakMap();

const CLOSURE_GETTER_NAME_REGEX = /^get(?<name>[A-Z]\w*)$/;
const CLOSURE_SETTER_NAME_REGEX = /^set(?<name>[A-Z]\w*)$/;
const CLOSURE_ACTION_NAME_REGEX = /^do(?<name>[A-Z]\w*)$/;

const ClosureMethodType = new Enumeration([
    "Getter",
    "Setter",
    "Action"
]);

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

    constructor(name, type) {
        this.name = name;
        this.type = type;
    }
}

function decapitalizeFirst(original) {
    return original.replace(/^[A-Z]/, s => s.toLowerCase());
}

function capitalizeFirst(original) {
    return original.replace(/^[A-Z]/, s => s.toUpperCase());
}

class ClosureGetter extends ClosureMethod {
    constructor(name) {
        super(name, ClosureMethodType.Getter);
    }

    static parse(value) {
        if (typeof value !== "string")
            throw new ArgumentTypeException("value", Type.of(value), Type.get(String));

        const matches = CLOSURE_GETTER_NAME_REGEX.exec(value);
        if (matches) {
            const name = decapitalizeFirst(matches.groups["name"]);
            return new ClosureGetter(name);
        }

        throw new FormatException(`"get"GetterName`, value);
    }
}

class ClosureSetter extends ClosureMethod {
    constructor(name) {
        super(name, ClosureMethodType.Setter);
    }

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
    constructor(name) {
        super(name, ClosureMethodType.Action);
    }

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
    let appliedNames = [];

    function getSetterByName(name) {
        return methods.find(m => m.type === ClosureMethodType.Setter && m.name === name);
    }

    function getGetterByName(name) {
        return methods.find(m => m.type === ClosureMethodType.Setter && m.name === name);
    }

    function applyGetterAndSetter(getter, setter) {
        const hasGetter = !!getter,
            hasSetter = !!setter;

        const name = (getter || setter).name;

        const closureGetterName = "get" + capitalizeFirst(name),
            closureSetterName = "set" + capitalizeFirst(name);

        Object.defineProperty(shell, name, {
            get: hasGetter ? closure[closureGetterName].bind(closure) : null,
            set: hasSetter ? closure[closureSetterName].bind(closure) : null
        });
    }

    function applyAction(action) {
        const closureName = "do" + capitalizeFirst(action.name);

        shell[action.name] = closure[closureName].bind(closure);
    }

    for (let method of methods) {
        if (appliedNames.includes(method.name)) continue;

        switch (method.type) {
            case ClosureMethodType.Getter:
                let setter = getSetterByName(method.name);
                applyGetterAndSetter(method, setter);
                break;

            case ClosureMethodType.Setter:
                let getter = getGetterByName(method.name);
                applyGetterAndSetter(getter, method);
                break;

            case ClosureMethodType.Action:
                applyAction(method);
                break;
        }

        appliedNames.push(method.name);
    }
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

        //applyClosureMethods([...getClosureMethods(this)], shell, this);
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