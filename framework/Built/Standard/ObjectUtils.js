import { ArgumentException } from "./Exceptions";
export const ObjectUtils = {
    hasPrototype(obj) {
        if (obj === null)
            return false;
        if (obj === undefined)
            return false;
        const prototype = Object.getPrototypeOf(obj);
        if (prototype === undefined)
            return false;
        return true;
    },
    getOwnPropertyKeys(obj) {
        return [...Object.getOwnPropertyNames(obj), ...Object.getOwnPropertySymbols(obj)];
    },
    crudeCopy(source, dest) {
        function overwriteProperty(dest, key, desc) {
            delete dest[key];
            Object.defineProperty(dest, key, desc);
        }
        if (!this.hasPrototype(source))
            throw new ArgumentException("source", `Value is null, undefined or does not implement the property "prototype".`);
        if (!this.hasPrototype(dest))
            throw new ArgumentException("dest", `Value is null, undefined or does not implement the property "prototype".`);
        for (let key of this.getOwnPropertyKeys(source)) {
            const destDesc = Object.getOwnPropertyDescriptor(dest, key);
            if (destDesc && !destDesc.configurable)
                continue;
            const sourceDesc = Object.getOwnPropertyDescriptor(source, key);
            overwriteProperty(dest, key, sourceDesc);
        }
        return dest;
    }
};
