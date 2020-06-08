
export type Constructor<T extends Object> = Function & T["constructor"];

export type Class<T extends Object> = {
    prototype: T,
    constructor: Constructor<T>
} & Constructor<T>;

export type Method<TArgs extends any[] = undefined[], TResult = void, TThisArg = undefined> = (this: TThisArg, ...args: TArgs) => TResult;

export type Instance<TClass extends Class<Object>> = Object & TClass["prototype"];

export type TryOutput<TResult> = { result?: TResult };