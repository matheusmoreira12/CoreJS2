import { NotSupportedException } from "../../Standard/index";
import { DeepReadonly, DeepClone } from "./Types";

export function getOwnPropertyKeys<T>(obj: T): (keyof T)[] {
    let keys: (string | symbol)[] = [...Object.getOwnPropertyNames(obj), ...Object.getOwnPropertySymbols(obj)];
    return <(keyof T)[]>keys;
}

export function copyProperty<T, U>(src: T, dest: U, key: keyof T, overwrite: boolean = true, bind: boolean = false): boolean {
    const oldDestDesc = Object.getOwnPropertyDescriptor(dest, key),
        isConfigurable = oldDestDesc ? oldDestDesc.configurable : true;

    if (!(<any>dest).hasOwnProperty(key) || overwrite && isConfigurable) {
        delete dest[<keyof U><unknown>key];

        const srcDesc = Object.getOwnPropertyDescriptor(src, key);
        const destDesc: PropertyDescriptor = { ...oldDestDesc, ...srcDesc };

        if (bind) {
            if (typeof destDesc.value == "function")
                destDesc.value = destDesc.value.bind(src);

            if (typeof destDesc.get == "function")
                destDesc.get = destDesc.get.bind(src);

            if (typeof destDesc.set == "function")
                destDesc.set = destDesc.set.bind(src);
        }

        Object.defineProperty(dest, key, destDesc);
        return true;
    }
    else
        return false;
}

export function crudeCopy<T, U>(src: T, dest: U, overwrite: boolean = true, bind: boolean = false): void {
    for (let key of getOwnPropertyKeys(src))
        copyProperty(src, dest, <keyof T>key, overwrite, bind);
}

export function deepEquals<T, U>(obj1: T, obj2: U) {
    if (obj1 !== null && typeof obj1 === "object") {
        //Check each property value
        for (let prop of getOwnPropertyKeys(obj1))
            if (!deepEquals(obj1[prop], obj2[<keyof U><unknown>prop])) return false;

        return true;
    }

    if (<any>obj1 !== <any>obj2) return false;

    return true;
}

export function makeNamedFunction(name: string): Function {
    const factory = new Function(`return function ${name}() {};`);
    return factory();
}

export function getBlank(obj: any) {
    let result: Function | Object | null = null;

    if (typeof obj == "function")
        result = makeNamedFunction(obj.name);
    else if (typeof obj == "object")
        result = {};
    else
        return obj;

    Object.setPrototypeOf(result, Object.getPrototypeOf(obj));
    Object.setPrototypeOf(result.constructor, Object.getPrototypeOf(obj.constructor));

    return result;
}

export function getDeepReadonly<T>(obj: T): DeepReadonly<T> {
    function getFrozen(obj: any): DeepReadonly<any> {
        if (obj === null || typeof obj !== "object")
            return obj;

        let frozenObj = getBlank(obj);
        for (let key of getOwnPropertyKeys(obj))
            frozenObj[key] = getFrozen(obj[key]);

        return Object.freeze(frozenObj);
    }

    return getFrozen(obj);
}

export function getDeepClone<T>(obj: T): DeepClone<T> {
    function getClone<U>(obj: U): DeepClone<U> {
        if (obj === null || typeof obj !== "object" || "isActiveClone" in obj)
            return obj;

        let clonedObj = getBlank(obj);
        for (let key of getOwnPropertyKeys(obj))
            clonedObj[key] = getClone(obj[<keyof U>key]);

        return clonedObj;
    }

    return <T>getClone(obj);
}

export function getBoundClone<T>(obj: T): DeepClone<T> {
    function getBoundClone<U>(obj: U): DeepClone<U> {
        if (obj === null || typeof obj !== "object")
            return obj;

        let boundCloneObj = getBlank(obj);
        for (let key of getOwnPropertyKeys(obj))
            copyProperty(obj, boundCloneObj, <keyof U>key, true, true);

        return boundCloneObj;
    }

    return <T>getBoundClone(obj);
}

export function getDefault(constructor: typeof String): string;
export function getDefault(constructor: typeof Number): string;
export function getDefault(constructor: typeof BigInt): string;
export function getDefault(constructor: typeof Boolean): string;
export function getDefault(constructor: null): null;
export function getDefault(constructor: undefined): undefined;
export function getDefault(constructor: typeof Object): object;
export function getDefault(constructor: typeof Array): Array<any>;
export function getDefault(constructor: typeof String | typeof Number | typeof BigInt | typeof Boolean | null | undefined | typeof Object | typeof Array): string | number | bigint | boolean | null | undefined | symbol | object | Array<any> {
    if (constructor === String)
        return "";
    else if (constructor === Number)
        return 0;
    else if (constructor === BigInt)
        return 0n;
    else if (constructor === Boolean)
        return false;
    else if (constructor === null)
        return null;
    else if (constructor === undefined)
        return undefined;
    else if (constructor === Object)
        return {};
    else if (constructor === Array)
        return [];
    else
        throw new NotSupportedException("Cannot get default value. The provided constructor is not supported.")
}

export type Method<TThis = any, TResult = any, TArg1 = any, TArg2 = any, TArg3 = any, TArg4 = any, TArg5 = any, TArg6 = any, TArg7 = any, TArg8 = any> = (this: TThis, arg1?: TArg1, arg2?: TArg2, arg3?: TArg3, arg4?: TArg4, arg5?: TArg5, arg6?: TArg6, arg7?: TArg7, arg8?: TArg8) => TResult;

export function getMixinMethod<TThis, TResultBase, TResult1>(baseMethod: Method<TThis, TResultBase>, mixinMethod1: Method<TThis, TResult1>): Method<TThis, MixinValue<TResultBase, TResult1>>;
export function getMixinMethod<TThis, TResultBase, TResult1, TResult2>(baseMethod: Method<TThis, TResultBase>, mixinMethod1: Method<TThis, TResult1>, mixinMethod2: Method<TThis, TResult2>): Method<TThis, MixinValue<TResultBase, TResult1, TResult2>>;
export function getMixinMethod<TThis, TResultBase, TResult1, TResult2, TResult3>(baseMethod: Method<TThis, TResultBase>, mixinMethod1: Method<TThis, TResult1>, mixinMethod2: Method<TThis, TResult2>, mixinMethod3: Method<TThis, TResult3>): Method<TThis, MixinValue<TResultBase, TResult1, TResult2, TResult3>>;
export function getMixinMethod<TThis, TResultBase, TResult1, TResult2, TResult3, TResult4>(baseMethod: Method<TThis, TResultBase>, mixinMethod1: Method<TThis, TResult1>, mixinMethod2: Method<TThis, TResult2>, mixinMethod3: Method<TThis, TResult3>, mixinMethod4: Method<TThis, TResult4>): Method<TThis, MixinValue<TResultBase, TResult1, TResult2, TResult3, TResult4>>;
export function getMixinMethod<TThis, TResultBase, TResult1, TResult2, TResult3, TResult4, TResult5>(baseMethod: Method<TThis, TResultBase>, mixinMethod1: Method<TThis, TResult1>, mixinMethod2: Method<TThis, TResult2>, mixinMethod3: Method<TThis, TResult3>, mixinMethod4: Method<TThis, TResult4>, mixinMethod5: Method<TThis, TResult5>): Method<TThis, MixinValue<TResultBase, TResult1, TResult2, TResult3, TResult4, TResult5>>;
export function getMixinMethod<TThis, TResultBase, TResult1, TResult2, TResult3, TResult4, TResult5, TResult6>(baseMethod: Method<TThis, TResultBase>, mixinMethod1: Method<TThis, TResult1>, mixinMethod2: Method<TThis, TResult2>, mixinMethod3: Method<TThis, TResult3>, mixinMethod4: Method<TThis, TResult4>, mixinMethod5: Method<TThis, TResult5>, mixinMethod6: Method<TThis, TResult6>): Method<TThis, MixinValue<TResultBase, TResult1, TResult2, TResult3, TResult4, TResult5, TResult6>>;
export function getMixinMethod<TThis, TResultBase, TResult1, TResult2, TResult3, TResult4, TResult5, TResult6, TResult7>(baseMethod: Method<TThis, TResultBase>, mixinMethod1: Method<TThis, TResult1>, mixinMethod2: Method<TThis, TResult2>, mixinMethod3: Method<TThis, TResult3>, mixinMethod4: Method<TThis, TResult4>, mixinMethod5: Method<TThis, TResult5>, mixinMethod6: Method<TThis, TResult6>, mixinMethod7: Method<TThis, TResult7>): Method<TThis, MixinValue<TResultBase, TResult1, TResult2, TResult3, TResult4, TResult5, TResult6, TResult7>>;
export function getMixinMethod(baseMethod: Method, ...mixinMethods: Method[]): Function {
    return function (this: any, ...args: any[]) {
        return getMixinValue(baseMethod.call(this, ...args), ...mixinMethods.map(mm => mm.call(this, ...args)));
    };
}

export type MixinValue<TBase = never, T1 = never, T2 = never, T3 = never, T4 = never, T5 = never, T6 = never, T7 = never, T8 = never> = TBase | T1 | T2 | T3 | T4 | T4 | T5 | T6 | T7 | T6 | T7 | T8;

export function getMixinValue<TBase>(baseValue: TBase): TBase;
export function getMixinValue<TBase, T1>(baseValue: TBase, mixinValue1: T1): TBase | T1;
export function getMixinValue<TBase, T1, T2>(baseValue: TBase, mixinValue1: T1, mixinValue2: T2): TBase | T1 | T2;
export function getMixinValue<TBase, T1, T2, T3>(baseValue: TBase, mixinValue1: T1, mixinValue2: T2, mixinValue3: T3): TBase | T1 | T2 | T3;
export function getMixinValue<TBase, T1, T2, T3, T4>(baseValue: TBase, mixinValue1: T1, mixinValue2: T2, mixinValue3: T3, mixinValue4: T4): TBase | T1 | T2 | T3 | T4;
export function getMixinValue<TBase, T1, T2, T3, T4, T5>(baseValue: TBase, mixinValue1: T1, mixinValue2: T2, mixinValue3: T3, mixinValue4: T4, mixinValue5: T5): TBase | T1 | T2 | T3 | T4 | T5;
export function getMixinValue<TBase, T1, T2, T3, T4, T5, T6>(baseValue: TBase, mixinValue1: T1, mixinValue2: T2, mixinValue3: T3, mixinValue4: T4, mixinValue5: T5, mixinValue6: T6): TBase | T1 | T2 | T3 | T4 | T5 | T6;
export function getMixinValue<TBase, T1, T2, T3, T4, T5, T6, T7>(baseValue: TBase, mixinValue1: T1, mixinValue2: T2, mixinValue3: T3, mixinValue4: T4, mixinValue5: T5, mixinValue6: T6, mixinValue7: T7): TBase | T1 | T2 | T3 | T4 | T5 | T6 | T7;
export function getMixinValue(baseValue: any, ...mixinValues: any[]): any {
    if (baseValue)
        return baseValue;
    for (let mixinValue of mixinValues)
        if (mixinValue)
            return mixinValue;
    return undefined;
}