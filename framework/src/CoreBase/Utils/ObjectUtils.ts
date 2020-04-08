import { NotSupportedException } from "../../Standard/index.js";
import { DeepReadonly, DeepClone } from "./Types.js";

export namespace ObjectUtils {
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

    export function makeNamedClass(name: string): Function {
        const factory = new Function(`return class ${name} {};`);
        return factory();
    }

    export function getBlank(obj: any) {
        let result: Function | Object | null = null;

        if (typeof obj == "function") {
            if (obj.toString().startsWith("class"))
                result = makeNamedClass(obj.name);
            else
                result = makeNamedFunction(obj.name);
        }
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

    export function getBoundClone<T>(obj: T): T {
        if (obj === null || typeof obj !== "object")
            return obj;

        let boundCloneObj = getBlank(obj);
        for (let key of getOwnPropertyKeys(obj))
            copyProperty(obj, boundCloneObj, <keyof T>key, true, true);

        return boundCloneObj;
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