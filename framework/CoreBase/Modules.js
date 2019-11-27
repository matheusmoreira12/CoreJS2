import { AsynchronousResolver } from "./Resolvers.js";

const NAMESPACE_SEPARATOR = "::";

export class Identifier {
    static get(value) {
        if (typeof value === "string")
            return Identifier.parse(value);

        if (value instanceof Identifier)
            return value;

        return null;
    }

    static get empty() {
        return new Identifier();
    }

    static parse(value) {
        if (typeof value != "string")
            throw `Invalid value for argument "value".`;

        return new Identifier(...value.split(NAMESPACE_SEPARATOR));
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

        return new Identifier(...this.items, ...value.items);
    }
}

class Export {
    constructor(identifier, value, parentModule = null) {
        identifier = Identifier.get(identifier);
        if (!identifier)
            throw `Invalid value for argument "identifier".`;

        this.identifier = identifier;
        this.value = value;
        this.parentModule = parentModule;
    }

    get fullIdentifier() {
        if (this.isOrphan)
            return this.identifier;

        return this.parentModule.fullNamespace.combine(this.identifier);
    }

    get isOrphan() {
        return this.parentModule === null;
    }
}

class ImportResolver extends AsynchronousResolver {
    static pending = [];

    static clearResolved() {
        for (let i = this.pending.length - 1; i > 0; i--) {
            let resolver = this.pending[i];
            if (resolver.status === ImportResolver.STATUS_RESOLVED ||
                resolver.status === ImportResolver.STATUS_REJECTED)
                this.pending.splice(i, 1);
        }
    }

    static resolve(_export, value) {
        function resolveRelative() {
            for (let resolver of this.pending) {
                if (resolver.status !== ImportResolver.STATUS_PENDING)
                    continue;
                if (resolver.fullIdentifier.equals(_export.fullIdentifier))
                    resolver.resolve(value);
            }
        }

        function resolveAbsolute() {
            for (let resolver of this.pending) {
                if (resolver.status !== ImportResolver.STATUS_PENDING)
                    continue;
                if (resolver.identifier.equals(_export.fullIdentifier))
                    resolver.resolve(value);
            }
        }

        resolveRelative.call(this);
        resolveAbsolute.call(this);

        this.clearResolved();
    }

    static resolveAll() {
        const allExports = rootModule.listExportsRecursive();
        for (let _export of allExports)
            this.resolve(_export, _export.value);
    }

    static rejectAll(error) {
        for (let resolver of this.pending) {
            if (resolver.status !== ImportResolver.STATUS_PENDING)
                continue;
            resolver.reject(error);
        }

        this.clearResolved();
    }

    constructor(identifier, parentModule = null) {
        identifier = Identifier.get(identifier);
        if (!identifier)
            throw `Invalid value for argument "identifier".`;

        super();

        this.identifier = identifier;
        this.parentModule = parentModule;

        ImportResolver.pending.push(this);
    }

    get isOrphan() {
        return this.parentModule === null;
    }

    get fullIdentifier() {
        if (this.isOrphan)
            return this.identifier;

        return this.parentModule.fullNamespace.combine(this.identifier);
    }
}

class ModuleContext {
    constructor(target) {
        this.target = target;

        return Object.freeze(this);
    }

    export(map) {
        function exportMember(identifier, value) {
            const _export = new Export(identifier, value, this.target);
            this.target.exports.push(_export);

            ImportResolver.resolveAll();
        }

        for (let key in map)
            exportMember.call(this, Identifier.parse(key), map[key]);
    }

    async module(namespace, initializer) {
        let target = new Module(namespace, initializer, this.target);
        this.target.subModules.push(target);

        await target.initialize();
    }

    async import(identifier) {
        const importResolver = new ImportResolver(identifier, this.target);

        ImportResolver.resolveAll();

        return await importResolver.resolved;
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
        namespace = Identifier.get(namespace);
        if (!namespace)
            throw `Invalid value for argument "namespace".`;

        this.namespace = namespace;
        this.initializer = initializer;
        this.parentModule = parentModule;

        this.exports = [];
        this.subModules = [];
    }

    async initialize() {
        this.status = Module.STATUS_INITIALIZING;

        const context = new ModuleContext(this);
        await this.initializer.call(globalThis, context);

        this.status = Module.STATUS_DONE;
    }

    *listExportsRecursive() {
        yield* this.exports;

        for (let subModule of this.subModules)
            yield* subModule.listExportsRecursive();
    }

    get fullNamespace() {
        if (this.isOrphan)
            return this.namespace;

        return this.parentModule.fullNamespace.combine(this.namespace);
    }

    get isOrphan() {
        return this.parentModule === null;
    }

    status = Module.STATUS_PENDING;
}

const rootModule = new Module(Identifier.empty, function () { });


function unload_handler() {
    window.removeEventListener("unload", unload_handler);

    ImportResolver.rejectAll(null);
}
window.addEventListener("unload", unload_handler);

/**Module Demonstration:
 * - Each module must be given its own namespace identifier. Keep in mind that module identifiers are RELATIVE.
 * - Sub-modules must be instantiated BEFORE any exports or imports, as well as any constant.
 * - Imports are solved asynchronously. Once the requested resource is exported, its import promise resolves. Please note that: if a resource is never
 * exported, its promise will never be resolved.
 *
 *  import { Module } from "<relative path to Modules.js>";
 *
 *  Module.declare("Demo", async function (context) {
 *      context.module("SubModule1", async function (context) {
 *          context.module("SubSubModule1", async function (context) {
 *              const CONST_A = "Some constant value.";
 *              context.export({ CONST_A })
 *
 *              class ClassA {
 *              }
 *              context.export({ ClassA });
 *          });
 *      });
 *
 *      context.module("SubModule2", async function (context) {
 *
 *      });
 *
 *      context.module("SubModule3", async function (context) {
 *
 *      });
 *
 *      class ClassB extends (await context.import("SubModule1::SubSubModule1::ClassA")) {
 *      }
 *      context.export({ ClassB });
 *  });
 */