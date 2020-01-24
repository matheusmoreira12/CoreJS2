import { ArgumentMissingException } from "../../Standard/index";
import { DeepReadonly, DeepClone, MixinBase } from "./index";

export function getOwnPropertyKeys<T>(obj: T): (keyof T)[] {
    let keys: (string | symbol)[] = [...Object.getOwnPropertyNames(obj), ...Object.getOwnPropertySymbols(obj)];
    return <(keyof T)[]>keys;
}

export function copyProperty<T, U>(src: T, dest: U, key: keyof T, overwrite: boolean = true, bind: boolean = false): boolean {
    const oldDestDesc = Object.getOwnPropertyDescriptor(dest, key),
        isConfigurable = oldDestDesc.configurable;

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
    let result: Function | Object = null;

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

export function createMixin<T1, T2>(obj1: T1, obj2: T2): T1 & T2 & MixinBase;
export function createMixin<T1, T2, T3>(obj1: T1, obj2: T2, obj3?: T3): T1 & T2 & T3 & MixinBase;
export function createMixin<T1, T2, T3, T4>(obj1: T1, obj2: T2, obj3?: T3, obj4?: T4): T1 & T2 & T3 & T4 & MixinBase;
export function createMixin<T1, T2, T3, T4, T5>(obj1: T1, obj2: T2, obj3?: T3, obj4?: T4, obj5?: T5): T1 & T2 & T3 & T4 & T5 & MixinBase;
export function createMixin<T1, T2, T3, T4, T5, T6>(obj1: T1, obj2: T2, obj3?: T3, obj4?: T4, obj5?: T5, obj6?: T6): T1 & T2 & T3 & T4 & T5 & T6 & MixinBase;
export function createMixin<T1, T2, T3, T4, T5, T6, T7>(obj1: T1, obj2: T2, obj3?: T3, obj4?: T4, obj5?: T5, obj6?: T6, obj7?: T7): T1 & T2 & T3 & T4 & T5 & T6 & T7 & MixinBase;
export function createMixin<T1, T2, T3, T4, T5, T6, T7, T8>(obj1: T1, obj2: T2, obj3?: T3, obj4?: T4, obj5?: T5, obj6?: T6, obj7?: T7, obj8?: T8): T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & MixinBase;
export function createMixin<T1, T2, T3, T4, T5, T6, T7, T8, T9>(obj1: T1, obj2: T2, obj3?: T3, obj4?: T4, obj5?: T5, obj6?: T6, obj7?: T7, obj8?: T8, obj9?: T9): T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & MixinBase;
export function createMixin<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10>(obj1: T1, obj2: T2, obj3?: T3, obj4?: T4, obj5?: T5, obj6?: T6, obj7?: T7, obj8?: T8, obj9?: T9, obj10?: T10): T1 & T2 & T3 & T4 & T5 & T6 & T7 & T8 & T9 & T10 & MixinBase;
export function createMixin(...objs: any[]): any {
    if (arguments.length < 1)
        throw new ArgumentMissingException("obj1");
    if (arguments.length < 2)
        throw new ArgumentMissingException("obj2");

    let result: MixinBase = getBlank(objs[0]);
    result.isMixin = true;
    result.baseObjects = objs;

    for (let i = 0; i < objs.length; i++)
        crudeCopy(objs[i], result, true, true);

    return result;
}