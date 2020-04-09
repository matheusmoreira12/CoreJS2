import { Enumeration } from "../Enumeration.js";

export type Constructor<T extends Object> = Function & T["constructor"];

export type Class<T extends Object> = {
    prototype: T,
    constructor: Constructor<T>
} & Constructor<T>;

export type Method<TArg1 = never, TArg2 = never, TArg3 = never, TArg4 = never, TArg5 = never, TArg6 = never, TArg7 = never, TArg8 = never, TArg9 = never, TArg10 = never, TArg11 = never, TArg12 = never, TArg13 = never, TArg14 = never, TArg15 = never, TArg16 = never, TRest extends any[] = never[], TResult = void, TThisArg = undefined> = (this: TThisArg, arg1: TArg1, arg2: TArg2, arg3: TArg3, arg4: TArg4, arg5: TArg5, arg6: TArg6, arg7: TArg7, arg8: TArg8, arg9: TArg9, arg10: TArg10, arg11: TArg11, arg12: TArg12, arg13: TArg13, arg14: TArg14, arg15: TArg15, arg16: TArg16, ...rest: TRest) => TResult;

export type Instance<TClass extends Class<Object>> = Object & TClass["prototype"];

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