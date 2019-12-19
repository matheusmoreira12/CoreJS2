export declare const arrayUtils: {
    detectArrayChanges(cached: any, current: any, addCallback: any, removeCallback: any, replaceCallback: any): void;
};
export declare const domUtils: {
    insertElementAt(parent: any, position: any, newChild: any): void;
};
export declare const objectUtils: {
    equals(obj1: any, obj2: any): boolean;
};
export declare const mapUtils: {
    invert<TKey, TValue>(value: Map<TKey, TValue>): Map<TValue, TKey>;
};
