const ENUMERATION_FLAG_NAME_PATTERN = /^[A-Z]\w*$/;
/**
 * Enumeration Class
 * Represents an enumeration of options.
 */
export class Enumeration {
    static intersect(value1, value2) {
        if (typeof value1 !== "number")
            throw new ArgumentTypeException("value1");
        if (typeof value2 !== "number")
            throw new ArgumentTypeException("value2");
        return value1 & value2;
    }
    static valuesIntersect(value1, value2) {
        return !!this.intersect(value1, value2);
    }
    static isFlagSet(flag, value) {
        if (typeof flag !== "number")
            throw new ArgumentTypeException("flag");
        if (typeof value !== "number")
            throw new ArgumentTypeException("value");
        return this.intersect(value, flag) === flag;
    }
    static contains(value1, value2) {
        return this.intersect(value1, value2) === value1;
    }
    constructor(descriptorMap) {
        function addFlag(name, value) {
            Object.defineProperty(this, name, {
                get() { return value; }
            });
        }
        if (descriptorMap instanceof Array) {
            for (let i = 0; i < descriptorMap.length; i++)
                addFlag.call(this, descriptorMap[i], i);
        }
        else if (descriptorMap instanceof Object)
            for (let key in descriptorMap) {
                if (!key.match(ENUMERATION_FLAG_NAME_PATTERN))
                    throw new FormatException("FlagName", key);
                let value = descriptorMap[key];
                if (typeof value !== "number")
                    throw new InvalidTypeException("value", Number);
                addFlag.call(this, key, value);
            }
        else
            throw new ArgumentTypeException("map", [Array, Object]);
    }
    convertToString(value) {
        function convertExact() {
            let result = map.get(value);
            if (result !== undefined)
                return result;
            return null;
        }
        function convertMultiple() {
            let flagStrs = [];
            for (let entry of map) {
                if (Enumeration.isFlagSet(entry[1], value))
                    flagStrs.push(entry[0]);
            }
            return flagStrs.join(", ");
        }
        if (typeof value !== "number")
            throw new ArgumentTypeException("value");
        let map = this.getAsMap();
        return convertExact() || convertMultiple();
    }
    convertFromString(value) {
        function convertMultiple() {
            let flagNames = value.split(/\s*,\s*/);
            let result = 0;
            for (let flagName of flagNames) {
                let flagValue = map.get(flagStr);
                if (flagName === undefined)
                    return null;
                result |= flagValue;
            }
            return result;
        }
        if (typeof value !== "string")
            throw new ArgumentTypeException("value");
        let map = this.getAsMap();
        let result = convertMultiple();
        if (result !== null)
            return result;
        throw new FormatException(`[FlagName1]["," ...FlagNameN]`, value);
    }
    getAsMap() {
        function* createMapEntries() {
            for (let key of Object.getOwnPropertyNames(this)) {
                let flag = this[key];
                if (!key.match(ENUMERATION_FLAG_NAME_PATTERN))
                    continue;
                if (typeof flag === "number")
                    yield [key, flag];
            }
        }
        return new Map(createMapEntries.call(this));
    }
}
