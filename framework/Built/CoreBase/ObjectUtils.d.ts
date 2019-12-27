export declare type DeepReadonly<T> = {
    readonly [P in keyof T]: DeepReadonly<T[P]>;
};
export declare type DeepClone<T> = {
    readonly [P in keyof T]: T[P];
};
export declare const ObjectUtils: {
    getBlank(obj: any): any;
    getDeepReadonly<T>(obj: T): DeepReadonly<T>;
    getDeepClone<T_1>(obj: T_1): DeepClone<T_1>;
};
