export type ConstructorOf<T extends Object> = T["constructor"];

export type ClassOf<T extends object> = ConstructorOf<T> & {
    prototype: T,
    constructor: Function
};

export type Method<TArgs extends any[] = [], TResult = void, TThisArg = void> = (this: TThisArg, ...args: TArgs) => TResult;

export type InstanceOf<TClass extends ClassOf<Object>> = Object & TClass["prototype"];

export type TryOutput<TResult> = { result?: TResult };