export type DeepReadonly<T> = {
    readonly [P in keyof T]: DeepReadonly<T[P]>;
};

export type DeepClone<T> = {
    readonly [P in keyof T]: T[P]
};

export const ObjectUtils = {
    getOwnPropertyKeys<T>(obj: T): (keyof T)[] {
        let keys: (string | symbol)[] = [...Object.getOwnPropertyNames(obj), ...Object.getOwnPropertySymbols(obj)];
        return <(keyof T)[]>keys;
    },

    copyProperty<T, U>(src: T, dest: U, key: keyof T, overwrite: boolean = true, bind: boolean = false): boolean {
        if (!(<any>dest).hasOwnProperty(key) || overwrite && (delete dest[<keyof U><unknown>key])) {
            const srcDesc = Object.getOwnPropertyDescriptor(src, key);
            const destDesc: PropertyDescriptor = { ...srcDesc };

            if (bind) {
                if (destDesc.value instanceof Function)
                    destDesc.value = destDesc.value.bind(src);

                if (destDesc.get instanceof Function)
                    destDesc.get = destDesc.get.bind(src);

                if (destDesc.set instanceof Function)
                    destDesc.set = destDesc.set.bind(src);
            }

            Object.defineProperty(dest, key, destDesc);
            return true;
        }
        else
            return false;
    },

    crudeCopy<T extends Object, U extends Object>(src: T, dest: U, overwrite: boolean = true, bind: boolean = false): void {
        for (let key of this.getOwnPropertyKeys(src))
            this.copyProperty(src, dest, <keyof T>key, overwrite, bind);
    },

    deepEquals<T, U>(obj1: T, obj2: U) {
        if (obj1 !== null && typeof obj1 === "object") {
            //Check each property value
            for (let prop of this.getOwnPropertyKeys(obj1))
                if (!this.deepEquals(obj1[prop], obj2[<keyof U><unknown>prop])) return false;

            return true;
        }

        if (<any>obj1 !== <any>obj2) return false;

        return true;
    },

    getBlank(obj: any) {
        return Object.create(Object.getPrototypeOf(obj));
    },

    getDeepReadonly<T>(obj: T): DeepReadonly<T> {
        function getFrozen(this: typeof ObjectUtils, obj: any): DeepReadonly<any> {
            if (obj === null || typeof obj !== "object")
                return obj;

            let frozenObj = this.getBlank(obj);
            for (let key of this.getOwnPropertyKeys(obj))
                frozenObj[key] = getFrozen.call(this, obj[key]);

            return Object.freeze(frozenObj);
        }

        return getFrozen.call(this, obj);
    },

    getDeepClone<T>(obj: T): DeepClone<T> {
        function getClone<U>(this: typeof ObjectUtils, obj: U): DeepClone<U> {
            if (obj === null || typeof obj !== "object" || "isActiveClone" in obj)
                return obj;

            let clonedObj = this.getBlank(obj);
            for (let key of this.getOwnPropertyKeys(obj))
                clonedObj[key] = getClone.call(this, obj[<keyof U>key]);

            return clonedObj;
        }

        return <T>getClone.call(this, obj);
    },

    getBoundClone<T>(obj: T): DeepClone<T> {
        function getBoundClone<U>(this: typeof ObjectUtils, obj: U): DeepClone<U> {
            if (obj === null || typeof obj !== "object")
                return obj;

            let boundCloneObj = this.getBlank(obj);
            for (let key of this.getOwnPropertyKeys(obj))
                this.copyProperty(obj, boundCloneObj, <keyof U>key, true, true);

            return boundCloneObj;
        }

        return <T>getBoundClone.call(this, obj);
    }
};