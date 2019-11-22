import { Enumeration } from "./Standard.Enumeration";
import { Collection } from "./Standard.Collections";
import { RegExpXContext } from "./Standard.Strings";
import { ArgumentTypeException } from "./exceptions";
import { Type } from "./Standard.Types";

let exports = new Collection();

const NAMESPACE_SEPARATOR = "::";

const REGEXPX_CONTEXT = new RegExpXContext();
REGEXPX_CONTEXT.declareNamedPattern("namespaceSeparator", `${NAMESPACE_SEPARATOR}`);
REGEXPX_CONTEXT.declareNamedPattern("identifier", `[A-Za-z_$]\\w+`);

const SEPARATOR_REGEXPX = REGEXPX_CONTEXT.createRegExpX(`$separator;`, "g");
const IDENTIFIER_REGEXPX = REGEXPX_CONTEXT.createRegExpX(`^($identifier;$namespaceSeparator;)*$identifier;$$`, "");

export class Identifier {
    static parse(value) {
        function getItems() {
            if (typeof value !== "string")
                throw "Invalid argument type. A value of type String was expected.";

            let matches = IDENTIFIER_REGEXPX.exec(value);
            if (!matches)
                return null;

            return items = value.split(SEPARATOR_REGEXPX);
        }

        const items = getItems();
        return new Identifier(items);
    }

    constructor(items) {
        this.items = items;

        return Object.freeze(this);
    }

    toString() {
        return this.items.join(itemsPACE_SEPARATOR);
    }

    combine(value) {
        if (!(value instanceof Identifier))
            throw new ArgumentTypeException("value", Type.of(value), Type.get(Identifier));

        return new Identifier([...this.items, ...valie.items]);
    }
}

const modules = new Collection();
const declarations = new Collection();



export class ModuleContext extends Proxy {
    static export(identifier, value) {

    }

    static import(identifier) {
    }

    constructor(module) {
        this.module = module;

        function set(target, p, value, receiver) {
            ModuleContext.export(p, value);
        }

        function get(target, p, receiver) {
            ModuleContext.import(p);
        }

        return new Proxy(this, {
            get,
            set
        });
    }
}

export const ModuleStatus = new Enumeration([
    "Pending",
    "Initializing",
    "Done"
]);

export class Module {
    static create(namespace, initializer) {
        const namespaceIdentifier = Identifier.parse(namespace);
        const module = new Module(initializer);
        modules.add(namespaceIdentifier, module);
        return module;
    }

    constructor(namespaceIdentifier, initializer) {
        this.namespaceIdentifier = namespaceIdentifier;
        this.initializer = initializer;
        this.moduleContext = new ModuleContext(this);
    }

    async initialize(context) {
        this.status = ModuleStatus.Initializing;

        const context = new ModuleContext(this);
        await this.initializer(context);

        this.status = ModuleStatus.Done;
    }

    context = new ModuleInitializationContext();
    status = ModuleStatus.Pending;
}