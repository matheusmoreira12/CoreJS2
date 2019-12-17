﻿export declare namespace Core.Standard {
    class ReferenceRetrievalRequest extends Promise {
        static readonly [Symbol.species]: PromiseConstructor;
        constructor(name: any, context: any);
        status: any;
    }
    export class ReferenceManagerContext {
        constructor(target?: any, parentContext?: any);
        _ownDeclarations: Map<any, any>;
        isContainedWithin(parentContext: any): boolean;
        getParentContexts(): Generator<any, void, unknown>;
        derive(target?: any): ReferenceManagerContext;
    }
    const ReferenceManager: {
        readonly rootContext: ReferenceManagerContext;
        declare(name: any, value: any, context: any): void;
        retrieve(name: any, context: any): ReferenceRetrievalRequest;
    };
    export { ReferenceManager };
}
