import { Interface } from "../interfaces/index.js";
import { Type } from "./index.js";
import { TypeConstraint } from "./type-constraints/index.js";

export type Primitive = null | undefined | boolean | number | string | symbol;

type PrimitiveOrComplex = Primitive | object;

export type ConstructorOf<T extends Object> = T["constructor"];

export type ClassOf<T extends object> = ConstructorOf<T> & {
    prototype: T,
    constructor: Function
};

export type Method<TArgs extends any[] = [], TResult = void, TThisArg = void> = (this: TThisArg, ...args: TArgs) => TResult;

export type InstanceOf<TClass extends ClassOf<Object>> = Object & TClass["prototype"];

export type TryOutput<TResult> = { result?: TResult };

export type TypeMatchingConstraint = Type<any> | Interface | TypeConstraint;