import { Enumeration } from "./Standard.Enumeration";
import { Collection } from "./Standard.Collections";
import { RegExpXContext } from "./Standard.Strings";
import { ArgumentTypeException, InvalidOperationException } from "./exceptions";
import { Type } from "./Standard.Types";

let exports = new Collection();

const NAMESPACE_SEPARATOR = "::";

const REGEXPX_CONTEXT = new RegExpXContext();
REGEXPX_CONTEXT.declareNamedPattern("namespaceSeparator", `${NAMESPACE_SEPARATOR}`);
REGEXPX_CONTEXT.declareNamedPattern("identifier", `[A-Za-z_$]\\w+`);

const IDENTIFIER_REGEXPX = REGEXPX_CONTEXT.createRegExpX(`^($identifier;$namespaceSeparator;)*$identifier;$$`, "");

export class Identifier {
    static get empty() {
        return new Identifier();
    }

    static parse(value) {
        function getItems() {
            if (typeof value !== "string")
                throw "Invalid argument type. A value of type String was expected.";

            let matches = IDENTIFIER_REGEXPX.exec(value);
            if (!matches)
                return null;

            return items = value.split(NAMESPACE_SEPARATOR);
        }

        const items = getItems();
        return new Identifier(items);
    }

    constructor(...items) {
        this.items = items;

        return Object.freeze(this);
    }

    toString() {
        return this.items.join(NAMESPACE_SEPARATOR);
    }

    equals(value) {
        if (!(value instanceof Identifier)) return false;

        return this.toString() === value.toString();
    }

    combine(value) {
        if (!(value instanceof Identifier))
            throw new ArgumentTypeException("value", Type.of(value), Type.get(Identifier));

        return new Identifier([...this.items, ...value.items]);
    }

    pop() {
        return new Identifier([...this.items].pop());
    }
}

class ModuleCollection extends Collection {
    constructor(parentModule) {
        this.parentModule = parentModule;
    }

    add(module) {
        module.parentModule = this.parentModule;
        this.add(module);
    }
}

const rootModule = new Module(Identifier.empty, function () { });

class ExportedMemberCollection extends Collection {
    constructor(parentModule) {
        this.parentModule = parentModule;
    }

    add(member) {
        member.parentModule = this.parentModule;
    }
}

class ExportedMember {
    constructor(identifier, value) {
        if (typeof identifier === "string")
            this.identifier = new Identifier(identifier);
        else if (identifier instanceof Identifier)
            this.identifier = identifier;

        this.value = value;

        return Object.freeze(this);
    }

    parentModule = null;

    get fullIdentifier() {
        if (this.isOrphanMember)
            return this.identifier;

        return this.parentModule.namespace.combine(this.identifier);
    }

    get isOrphanMember() {
        return this.parentModule === null;
    }
}

export class ModuleContext {
    constructor(module) {
        this.module = module;

        return Object.freeze(this);
    }

    export(map) {
        function exportMember(identifier, value) {
            const exportedMember = new ExportedMember(identifier, value);
            this.exportedMembers.add(exportedMember);
        }

        for (let key in map)
            exportMember.call(this, new Identifier(key), map[key]);
    }

    async module(namespace, initializer) {
        let module = new Module(namespace, initializer);
        this.subModules.add(module);

        await module.initialize();
    }

    async import(identifier) {
        let member = null;

        while (!member)
            member = this.module.getMemberByIdentifierRecursive(identifier);

        return member;
    }
}

export const ModuleStatus = new Enumeration([
    "Pending",
    "Initializing",
    "Done"
]);

export class Module {
    static async declare(namespace, initializer) {
        if (typeof namespace !== "string" && (namespace instanceof Identifier))
            throw new ArgumentTypeException("namespace", Type.of(namespace), Type.get(Identifier));

        const module = new Module(namespace, initializer);
        rootModule.subModules.add(module);

        await module.initialize();
    }

    constructor(namespace, initializer) {
        if (typeof namespace === "string")
            this.namespace = new Identifier(namespace);
        else if (namespace instanceof Identifier)
            this.namespace = namespace;

        this.initializer = initializer;

        return Object.freeze(this);
    }

    async initialize() {
        this.status = ModuleStatus.Initializing;

        const context = new ModuleContext(this);
        await this.initializer.call(globalThis, context);

        this.status = ModuleStatus.Done;
    }

    *listMembersRecursive() {
        yield* this.exportedMembers;

        for (let subModule of this.subModules)
            yield* subModule.exportedMembers;
    }

    getMemberByIdentifierRecursive(identifier) {
        for (let member of this.listMembersRecursive())
            if (member.fullIdentifier.equals(identifier))
                return member;

        return undefined;
    }

    get fullNamespace() {
        if (this.isOrphanModule)
            return this.namespace;

        return this.parentModule.namespace.combine(this.namespace);
    }

    get isOrphanModule() {
        return this.parentModule === null;
    }

    exportedMembers = new ExportedMemberCollection(this);

    subModules = new ModuleDeclarationCollection(this);

    parentModule = null;

    status = ModuleStatus.Pending;
}

/**Module Demonstration:
 * - Each module must be given its own namespace identifier. Keep in mind that module identifiers are RELATIVE.
 * - Sub-modules must be instantiated BEFORE any exports or imports, as well as any constant.
 * - Imports are solved asynchronously. Once the requested resource is exported, its import promise resolves. Please note that: if a resource is never
 * exported, its promise will never be resolved.
 *
 * import { Module } from "<relative path to Modules.js>";
 *
 *  Module.declare("Demo", async function (context) {
 *      context.module("SubModule1", async function (context) {
 *          Module.create("SubSubModule1", async function (context) {
 *              const CONST_A = "Some constant value.";
 *              context.export({ CONST_A })
 *
 *              class ClassA {
 *              }
 *              context.export({ ClassA });
 *          }
 *      }
 *
 *      context.module("SubModule2", async function (context) {
 *
 *      }
 *
 *      context.module("SubModule3", async function (context) {
 *
 *      }
 *
 *      class ClassB extends (await this.import("SubModule1::SubSubModule1::ClassA")) {
 *      }
 *      context.export({ ClassB });
 *  });
 */