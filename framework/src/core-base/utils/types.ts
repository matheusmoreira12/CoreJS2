export type DeepReadonly<T> = {
    readonly [P in keyof T]: DeepReadonly<T[P]>;
};

export type DeepClone<T> = {
    readonly [P in keyof T]: T[P]
};

export type MixinBase = {
    isMixin: true;
    baseConstructors: any[];
    baseInstances: any[];
};

export type CompareSelectPredicate<T, U, TResult> = (a: T, b: U, quit: () => void, skip: () => void) => TResult;