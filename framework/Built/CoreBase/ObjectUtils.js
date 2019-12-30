import { ArgumentException } from "../Standard/Exceptions";
export const ObjectUtils = {
    getOwnPropertyKeys(obj) {
        return [...Object.getOwnPropertyNames(obj), ...Object.getOwnPropertySymbols(obj)];
    },
    copyProperty(src, dest, key, overwrite = true, bind = false) {
        if (!dest.hasOwnProperty(key) || overwrite && (delete dest[key])) {
            const srcDesc = Object.getOwnPropertyDescriptor(src, key);
            const destDesc = Object.assign({}, srcDesc);
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
    crudeCopy(src, dest, overwrite = true, bind = false) {
        if (!this.hasPrototype(src))
            throw new ArgumentException("src", `Value is null, undefined or does not implement the property "prototype".`);
        if (!this.hasPrototype(dest))
            throw new ArgumentException("dest", `Value is null, undefined or does not implement the property "prototype".`);
        for (let key of this.getOwnPropertyKeys(src))
            this.copyProperty(src, dest, key, overwrite, bind);
        return dest;
    },
    deepEquals(obj1, obj2) {
        if (obj1 !== null && typeof obj1 === "object") {
            //Check each property value
            for (let prop of this.getOwnPropertyKeys())
                if (!this.deepEquals(obj1[prop], obj2[prop]))
                    return false;
            return true;
        }
        if (obj1 !== obj2)
            return false;
        return true;
    },
    getBlank(obj) {
        return Object.create(Object.getPrototypeOf(obj));
    },
    getDeepReadonly(obj) {
        function getFrozen(obj) {
            if (obj === null || typeof obj !== "object")
                return obj;
            let frozenObj = this.getBlank(obj);
            for (let key of this.getOwnPropertyKeys(obj))
                frozenObj[key] = getFrozen(obj[key]);
            return Object.freeze(frozenObj);
        }
        return getFrozen(obj);
    },
    getDeepClone(obj) {
        function getClone(obj) {
            if (obj === null || typeof obj !== "object" || "isActiveClone" in obj)
                return obj;
            let clonedObj = this.getBlank(obj);
            for (let key of this.getOwnPropertyKeys(obj))
                clonedObj[key] = getClone(obj[key]);
        }
        return getClone(obj);
    },
    getBoundClone(obj) {
        function getBoundClone(obj) {
            if (obj === null || typeof obj !== "object")
                return obj;
            let boundObj = this.getBlank(obj);
            for (let key of this.getOwnPropertyKeys(obj)) {
            }
        }
        return getBoundClone(obj);
    }
};
