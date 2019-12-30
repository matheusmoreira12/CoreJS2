export declare type DeepReadonly<T> = {
    readonly [P in keyof T]: DeepReadonly<T[P]>;
};
export declare type DeepClone<T> = {
    readonly [P in keyof T]: T[P];
};
export declare const ObjectUtils: {
    getOwnPropertyKeys(obj: any): (string | symbol)[];
    copyProperty(src: object, dest: object, key: string | number | symbol, overwrite?: boolean, bind?: boolean): boolean;
    crudeCopy(src: object, dest: object, overwrite?: boolean, bind?: boolean): object;
    deepEquals(obj1: any, obj2: any): boolean;
    getBlank(obj: any): any;
    getDeepReadonly<T>(obj: T): DeepReadonly<T>;
    getDeepClone<T_1>(obj: T_1): DeepClone<T_1>;
    getBoundClone<T_2>(obj: T_2): DeepClone<T_2>;
};
