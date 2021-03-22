import { Enumeration } from "../Enumeration.js";

export type ConstructorOf<T extends Object> = T["constructor"] & Function;

export type ClassOf<T extends Object> = ConstructorOf<T> & {
    prototype: T,
    constructor: ConstructorOf<T>
};

export type Method<TArgs extends any[] = undefined[], TResult = void, TThisArg = undefined> = (this: TThisArg, ...args: TArgs) => TResult;

export type InstanceOf<TClass extends ClassOf<Object>> = TClass["prototype"] & Object;

export type TryOutput<TResult> = { result?: TResult };

export const MemberSelectionAttributes = Enumeration.create({
    Any: 0,
    Configurable: 1,
    Enumerable: 2,
    Writable: 4,
});

export const MemberSelectionType = Enumeration.create({
    Property: 1,
    Function: 2,
    Field: 4,
    Instance: 8,
    Static: 16,
    Any: 31,
});

export const MemberAttributes = Enumeration.create({
    Configurable: 1,
    Enumerable: 2,
    Writable: 4
});

export const MemberType = Enumeration.create({
    Property: 1,
    Function: 2,
    Field: 4,
    Instance: 8,
    Static: 16
});