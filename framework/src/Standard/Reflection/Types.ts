export type ConstructorOf<T extends Object> = Function & T["constructor"];

export type ClassOf<T extends Object> = {
    prototype: T,
    constructor: ConstructorOf<T>
} & ConstructorOf<T>;

export type Method<TArgs extends any[] = undefined[], TResult = void, TThisArg = undefined> = (this: TThisArg, ...args: TArgs) => TResult;

export type Instance<TClass extends ClassOf<Object>> = Object & TClass["prototype"];

export type TryOutput<TResult> = { result?: TResult };