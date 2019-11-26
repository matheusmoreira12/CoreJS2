import { AsynchronousResolver } from "./Standard.Resolvers.js";

const NAMESPACE_SEPARATOR = "::";

export class Identifier {
    static get empty() {
        return new Identifier();
    }

    static parse(value) {
        return new Identifier(value.split(NAMESPACE_SEPARATOR));
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
            throw `Invalid value for argument "value".`;

        return new Identifier([...this.items, ...value.items]);
    }

    pop() {
        return new Identifier([...this.items].pop());
    }
}

class Export {
    constructor(identifier, value, parentModule = null) {
        if (typeof identifier === "string")
            this.identifier = new Identifier(identifier);
        else if (identifier instanceof Identifier)
            this.identifier = identifier;
        else
            throw `Invalid value for argument "identifier".`;

        this.value = value;
        this.parentModule = parentModule;
    }

    get fullIdentifier() {
        if (this.isOrphanMember)
            return this.identifier;

        return this.parentModule.namespace.combine(this.identifier);
    }

    get isOrphanMember() {
        return this.parentModule === null;
    }
}

class ExportResolver extends AsynchronousResolver {
    constructor(identifier) {
        this.identifier = identifier;
    }
}

class ModuleContext {
    constructor(module) {
        this.module = module;

        return Object.freeze(this);
    }

    export(map) {
        function exportMember(identifier, value) {
            const _export = new Export(identifier, value, this.module);
            this.module.exportedMembers.push(_export);
        }

        for (let key in map)
            exportMember.call(this, new Identifier(key), map[key]);
    }

    async exportModule(namespace, initializer) {
        let module = new Module(namespace, initializer, this.module);
        this.module.subModules.push(module);

        await module.initialize();
    }

    async import(identifier) {
        function importRelative() {
            const absoluteIdentifier = this.module.namespace.combine(identifier);
            return this.module.getMemberByIdentifierRecursive(absoluteIdentifier);
        }

        function importAbsolute() {
            return this.module.getMemberByIdentifierRecursive(identifier);
        }

        let member = null;

        while (!member)
            member = importRelative | importAbsolute;

        return member.value;
    }
}

export class Module {
    static get STATUS_PENDING() { return 0; }
    static get STATUS_INITIALIZING() { return 1; }
    static get STATUS_DONE() { return 2; }

    static async declare(namespace, initializer) {
        const module = new Module(namespace, initializer, rootModule);
        rootModule.subModules.push(module);

        await module.initialize();
    }

    constructor(namespace, initializer, parentModule = null) {
        if (typeof namespace === "string")
            this.namespace = new Identifier(namespace);
        else if (namespace instanceof Identifier)
            this.namespace = namespace;
        else
            throw `Invalid value for argument "namespace".`;

        this.initializer = initializer;
        this.parentModule = parentModule;

        this.exportedMembers = [];
        this.subModules = [];
    }

    async initialize() {
        this.status = Module.STATUS_INITIALIZING;

        const context = new ModuleContext(this);
        await this.initializer.call(globalThis, context);

        this.status = Module.STATUS_DONE;
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

    parentModule = null;

    status = Module.STATUS_PENDING;
}

const rootModule = new Module(Identifier.empty, function () { });

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