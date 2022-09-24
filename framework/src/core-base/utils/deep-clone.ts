export type DeepClone<T> = {
    readonly [P in keyof T]: T[P];
};
