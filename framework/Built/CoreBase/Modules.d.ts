export declare class Identifier {
    static get(value: any): Identifier;
    static get empty(): Identifier;
    static parse(value: any): Identifier;
    constructor(...items: any[]);
    toString(): any;
    equals(value: any): boolean;
    combine(value: any): Identifier;
    get isEmpty(): boolean;
}
export declare class Module {
    static get STATUS_PENDING(): number;
    static get STATUS_INITIALIZING(): number;
    static get STATUS_DONE(): number;
    static declare(namespace: any, initializer: any, parentModule?: Module): Promise<Module>;
    constructor(namespace: any, initializer: any, parentModule?: any);
    initialize(): Promise<void>;
    listExportsRecursive(): Generator<any, void, any>;
    get fullNamespace(): any;
    get isOrphan(): boolean;
    status: number;
}
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
