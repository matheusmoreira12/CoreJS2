import { NotSupportedException } from "../../standard/exceptions/index.js"
import { DeepClone } from "./deep-clone";
import { DeepReadonly } from "./deep-readonly";
import { ArrayUtils } from "./index.js";
import { AllPropertyDescriptorsAsTuples, AllPropertyDescriptorsMap, Detuplified, OwnPropertyDescriptorsAsTuples, PropertyName, PropertySymbol, Tuplified } from "./types.js";

export namespace ObjectUtils {
    export function getAllPropertyKeys<T>(obj: T): IterableIterator<keyof T> {
        if (obj === null || obj === undefined)
            return ArrayUtils.empty();
        return ArrayUtils.unique(ArrayUtils.selectMany(getPrototypeTree(obj as T), o => getOwnPropertyKeys(o)));
    }

    export function* getOwnPropertyKeys<T>(obj: T): IterableIterator<keyof T> {
        yield* Object.getOwnPropertyNames(obj) as (keyof T)[];
        yield* Object.getOwnPropertySymbols(obj) as (keyof T)[];
    }

    export function getAllPropertySymbols<T>(obj: T): IterableIterator<PropertySymbol<T>> {
        if (obj === null || obj === undefined)
            return ArrayUtils.empty();
        return ArrayUtils.unique(ArrayUtils.selectMany(getPrototypeTree(obj), o => Object.getOwnPropertySymbols(o))) as IterableIterator<PropertySymbol<T>>;
    }

    export function getAllPropertyNames<T>(obj: T): IterableIterator<PropertyName<T>> {
        if (obj === null || obj === undefined)
            return ArrayUtils.empty();
        return ArrayUtils.unique(ArrayUtils.selectMany(getPrototypeTree(obj), o => Object.getOwnPropertyNames(o))) as IterableIterator<PropertyName<T>>;
    }

    export function getAllPropertyDescriptors<T>(obj: T): AllPropertyDescriptorsMap<T> {
        if (obj === null || obj === undefined)
            return {} as AllPropertyDescriptorsMap<T>;
        return detuplify(ArrayUtils.whereUnique(ArrayUtils.selectMany(getPrototypeTree(obj as T), o => tuplify(Object.getOwnPropertyDescriptors(o))), d => d[0])) as unknown as AllPropertyDescriptorsMap<T>;
    }

    export function getAllPropertyDescriptorsAsTuples<T>(obj: T): AllPropertyDescriptorsAsTuples<T> {
        if (obj === null || obj === undefined)
            return ArrayUtils.empty() as AllPropertyDescriptorsAsTuples<T>;
        return ArrayUtils.whereUnique(ArrayUtils.selectMany(getPrototypeTree(obj), o => ArrayUtils.select(tuplify(Object.getOwnPropertyDescriptors(o)), t => [o, t[0], t[1]])), u => u[2]) as AllPropertyDescriptorsAsTuples<T>;
    }

    export function getOwnPropertyDescriptorsAsTuples<T>(obj: T): OwnPropertyDescriptorsAsTuples<T> {
        if (obj === null || obj === undefined)
            return ArrayUtils.empty() as OwnPropertyDescriptorsAsTuples<T>;
        return ArrayUtils.select(tuplify(Object.getOwnPropertyDescriptors(obj)), t => [t[0], t[1]]) as OwnPropertyDescriptorsAsTuples<T>;
    }

    export function tuplify<T>(obj: T): Tuplified<T> {
        if (obj === null || obj === undefined)
            return ArrayUtils.empty();
        return ArrayUtils.select(Object.getOwnPropertyNames(obj) as PropertyName<T>[], n => [n, obj[n]]);
    }

    export function detuplify<T extends IterableIterator<[string, any]>>(tuples: T): Detuplified<T> {
        return ArrayUtils.aggregate(tuples, (o, t) => o[t[0] as keyof Detuplified<T>] = o[t[1]], {} as Detuplified<T>);
    }

    export function getAnyPropertyDescriptor<T>(obj: T, key: keyof T): PropertyDescriptor | undefined {
        if (obj === null || obj === undefined)
            return undefined;
        return ArrayUtils.first(ArrayUtils.select(getPrototypeTree(obj), o => Object.getOwnPropertyDescriptor(o, key)), d => !!d);
    }

    export function* getPrototypeTree<T>(obj: T): IterableIterator<T> {
        if (obj === null || obj === undefined)
            return;
        while (obj) {
            yield obj;
            obj = Object.getPrototypeOf(obj);
        }
    }

    export function copyProperty<T, U>(src: T, dest: U, key: keyof T, overwrite: boolean = true, bind: boolean = false): boolean {
        const oldDestDesc = getAnyPropertyDescriptor(dest, <keyof U><unknown>key),
            isConfigurable = oldDestDesc ? oldDestDesc.configurable : true;

        if ((!oldDestDesc || overwrite) && isConfigurable) {
            delete dest[<keyof U><unknown>key];

            const srcDesc = getAnyPropertyDescriptor(src, key);
            if (srcDesc) {
                const destDesc: PropertyDescriptor = { ...srcDesc };
                if (bind) {
                    if (typeof srcDesc.value == "function")
                        destDesc.value = srcDesc.value.bind(src);
                    if (srcDesc.get)
                        destDesc.get = srcDesc.get.bind(src);
                    if (srcDesc.set)
                        destDesc.set = srcDesc.set.bind(src);
                }
                Object.defineProperty(dest, key, destDesc);
                return true;
            }
            else
                return false;
        }
        else
            return false;
    }

    export function crudeCopy<T, U>(src: T, dest: U, overwrite: boolean = true, bind: boolean = false): void {
        for (let key of getAllPropertyKeys(src))
            copyProperty(src, dest, <keyof T>key, overwrite, bind);
    }

    export function deepEquals<T, U>(obj1: T, obj2: U) {
        if (obj1 && typeof obj1 === "object" && obj2 && typeof obj2 === "object") {
            for (let k of getOwnPropertyKeys(obj1)) {
                if (!deepEquals(obj1[k], obj2[k as unknown as keyof U]))
                    return false;
            }
            return true;
        }
        return obj1 as unknown === obj2 as unknown
    }

    export function makeNamedFunction(name: string): Function {
        return new Function(`return function ${name}() {};`)();
    }

    export function makeNamedClass(name: string): Function {
        return new Function(`return class ${name} {};`)();
    }

    export function getBlank(obj: any) {
        let r: Function | Object | null = null;
        if (typeof obj == "function") {
            if (obj.toString().startsWith("class"))
                r = makeNamedClass(obj.name);
            else
                r = makeNamedFunction(obj.name);
        }
        else if (typeof obj == "object")
            r = {};
        else
            return obj;
        Object.setPrototypeOf(r, Object.getPrototypeOf(obj));
        Object.setPrototypeOf(r.constructor, Object.getPrototypeOf(obj.constructor));
        return r;
    }

    export function getDeepReadonly<T>(obj: T): DeepReadonly<T> {
        function getFrozen(obj: any): DeepReadonly<any> {
            if (obj === null || typeof obj !== "object")
                return obj;
            let f = getBlank(obj);
            for (let k of getOwnPropertyKeys(obj))
                f[k] = getFrozen(obj[k]);
            return Object.freeze(f);
        }
        return getFrozen(obj);
    }

    export function getDeepClone<T>(obj: T): DeepClone<T> {
        function getClone<U>(obj: U): DeepClone<U> {
            if (obj === null || typeof obj !== "object" || "isActiveClone" in obj)
                return obj;
            let c = getBlank(obj);
            for (let k of getOwnPropertyKeys(obj))
                c[k] = getClone(obj[<keyof U>k]);
            return c;
        }
        return <T>getClone(obj);
    }

    export function getBoundClone<T>(obj: T): T {
        if (obj === null || typeof obj !== "object")
            return obj;
        let c = getBlank(obj);
        for (let k of getOwnPropertyKeys(obj))
            copyProperty(obj, c, <keyof T>k, true, true);
        return c;
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
}