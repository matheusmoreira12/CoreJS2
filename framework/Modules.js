import { Enumeration } from "./Standard.Enumeration";
import { Dictionary } from "./Standard.Collections";
import { RegExpX } from "./Standard.String";
import { RegExpXContext } from "./Standard.Strings";

let exports = new Collection();

const REGEXPX_CONTEXT = new RegExpXContext();
REGEXPX_CONTEXT.declareNamedPattern("namespaceSeparator", `::`);
REGEXPX_CONTEXT.declareNamedPattern("identifier", `[A-Za-z_$]\\w+`);

const SEPARATOR_REGEXPX = REGEXPX_CONTEXT.createRegExpX(`$separator;`, "g");
const IDENTIFIER_REGEXPX = REGEXPX_CONTEXT.createRegExpX(`^($identifier;$namespaceSeparator;)*$identifier;$$`, "");

export class Identifier {
    static parse(value) {
        function getNames() {
            let matches = IDENTIFIER_REGEXPX.exec(value);
            if (!matches)
                return null;

            return names = value.split(SEPARATOR_REGEXPX);
        }

        const names = getNames();
        return new Identifier(names);
    }

    constructor(names) {
        this.names = names;

        return Object.freeze(this);
    }
}

export const ModuleSystem = {

};

export const ModuleMemberType = new Enumeration([
    Class,
    Function,
    Const
]);

export class ModuleInitializationContext {
    export(name, memberType) {

    }

    import(name) {
    }
}

export class Module {
    constructor(namespace) {
        this.namespace = namespace;
    }

    async initialize(context) {

    }
}