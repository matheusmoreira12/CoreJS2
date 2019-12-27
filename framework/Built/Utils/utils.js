import { ArgumentException } from "../Standard/Exceptions";
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
    },
    deepEquals(obj1, obj2) {
        if (obj1 instanceof Object) {
            //Check each property value
            for (let prop in obj1)
                if (!this.deepEquals(obj1[prop], obj2[prop]))
                    return false;
            return true;
        }
        if (obj1 !== obj2)
            return false;
        return true;
    }
};
export const ArrayUtils = {
    detectArrayChanges(cached, current, addCallback, removeCallback, replaceCallback) {
        for (let i = 0; i < current.length || i < cached.length; i++) {
            if (i >= cached.length)
                addCallback(current[i], i);
            else if (i >= current.length)
                removeCallback(cached[i], i);
            else {
                if (ObjectUtils.deepEquals(cached[i], current[i]))
                    continue;
                replaceCallback(cached[i], [current[i]], i);
            }
        }
    }
};
export const DomUtils = {
    insertElementAt(parent, position, newChild) {
        if (parent.children.length === 0 || position >= parent.children.length)
            parent.appendChild(newChild);
        else {
            let refChild = parent.children[position];
            parent.insertBefore(newChild, refChild);
        }
    }
};
export const MapUtils = {
    invert(value) {
        function* generateInvertedEntries() {
            for (let entry of value)
                yield [entry[1], entry[0]];
        }
        return new Map(generateInvertedEntries());
    }
};
