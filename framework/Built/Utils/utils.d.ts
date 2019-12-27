export declare const ObjectUtils: {
    hasPrototype(obj: object): boolean;
    getOwnPropertyKeys(obj: object): (string | symbol)[];
    crudeCopy(source: object, dest: object): object;
    deepEquals(obj1: any, obj2: any): boolean;
};
export declare const ArrayUtils: {
    detectArrayChanges(cached: any, current: any, addCallback: any, removeCallback: any, replaceCallback: any): void;
};
export declare const DomUtils: {
    insertElementAt(parent: any, position: any, newChild: any): void;
};
export declare const MapUtils: {
    invert<TKey, TValue>(value: Map<TKey, TValue>): Map<TValue, TKey>;
};
