import { Interface } from "../interfaces/index.js";
import { Type } from "./index.js";
import { TypeConstraint } from "./type-constraints/index.js";

export type Primitive = null | undefined | boolean | number | string | symbol;

type PrimitiveOrComplex = Primitive | object;

export type Method<TArgs extends any[] = [], TResult = void, TThisArg = void> = (this: TThisArg, ...args: TArgs) => TResult;

type GenericClass<TInstance = any> = { "constructor": Function, "prototype": TInstance };

type GenericInstance<TClass = any> = { "constructor": NewableFunction & TClass }

export type ConstructorOf<T extends GenericClass | GenericInstance | null | undefined> = T extends (null | undefined) ? never : T extends (GenericClass | GenericInstance) ? T["constructor"] : never;

type ClassOfPrimitive<TPrimitive extends Primitive> = TPrimitive extends null ? null : TPrimitive extends typeof undefined ? undefined : TPrimitive extends boolean ? typeof Boolean : TPrimitive extends number ? typeof Number : TPrimitive extends string ? typeof String : TPrimitive extends symbol ? typeof Symbol : never;

export type ClassOf<TInstance extends GenericInstance | Primitive> = TInstance extends Primitive ? ClassOfPrimitive<TInstance> : TInstance extends GenericInstance ? ConstructorOf<TInstance> : never;

type PrimitiveOfClass<TClass extends ClassOfPrimitive<Primitive>> = TClass extends null ? null : TClass extends typeof undefined ? undefined : TClass extends typeof Boolean ? boolean : TClass extends typeof Number ? number : TClass extends typeof String ? string : TClass extends typeof Symbol ? symbol : never;

export type InstanceOf<TClass extends GenericClass<any> | ClassOfPrimitive<Primitive>> = TClass extends ClassOfPrimitive<Primitive> ? PrimitiveOfClass<TClass> : TClass extends GenericClass<any> ? TClass["prototype"] : never;

export type TryOutput<TResult> = { result?: TResult };

export type TypeMatchingConstraint = Type<any> | Interface | TypeConstraint;