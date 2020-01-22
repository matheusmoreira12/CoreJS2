export declare type DeepReadonly<T> = {
    readonly [P in keyof T]: DeepReadonly<T[P]>;
};
export declare type DeepClone<T> = {
    readonly [P in keyof T]: T[P];
};
export declare type MixinBase = {
    isMixin: boolean;
    baseObjects: any[];
};
export declare type CompareSelectPredicate<T, U, TResult> = (a: T, b: U, quit: () => void, skip: () => void) => TResult;
