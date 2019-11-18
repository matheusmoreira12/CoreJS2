import { Enumeration } from "./Standard.Enumeration";
import { Dictionary } from "./Standard.Collections";
import { RegExpX } from "./Standard.String";

let exports = new Collection();

const REGEXPX_CONTEXT = RegExpX.getNewContext();

REGEXPX_CONTEXT.declareNamedPattern("namespaceSeparator", `::`);
REGEXPX_CONTEXT.declareNamedPattern("identifier", '[A-Za-z_$]');
const SEPARATOR_REGEXPX = new RegExpX(`$separator;`, "g", REGEXPX_CONTEXT);
const IDENTIFIER_REGEXPX = new RegExpX(`^($identifier;$namespaceSeparator;)*$identifier;$$`, "", REGEXPX_CONTEXT);

export class Identifier {

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