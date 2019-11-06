import { Dictionary, KeyValuePair } from "./Standard.Collections.js";
import { FormatException, ArgumentTypeException } from "./exceptions.js";

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
        if (typeof value !== "number")
            throw new ArgumentTypeException("value");

        let dictionary = this.getAsDictionary();

        for (let flagKeyValuePair of dictionary) { //Search for exact enum values first
            if (flagKeyValuePair.value === value)
                return flagKeyValuePair.key;
        }

        let flagStrs = [];

        for (let flagKeyValuePair of dictionary) { //Then proceed to a more detailed look 
            if (Enumeration.isFlagSet(flagKeyValuePair.value, value))
                flagStrs.push(flagKeyValuePair.key);
        }

        return flagStrs.join(", ");
    }

    convertFromString(value) {
        if (typeof value !== "string")
            throw new ArgumentTypeException("value");

        let flagStrs = value.split(/\s*,\s*/);

        let dictionary = this.getAsDictionary();

        for (let flagKeyValuePair of dictionary) { //Search for exact enum values first
            if (value === flagKeyValuePair.key)
                return flagKeyValuePair.value;
        }

        let result = 0;

        for (let flagKeyValuePair of dictionary) { //Then proceed to a more detailed look 
            if (flagStrs.includes(flagKeyValuePair.key))
                result |= flagKeyValuePair.value;
        }

        return result;
    }

    getAsDictionary() {
        function* createFlagKeyValuePairs() {
            for (let key of Object.getOwnPropertyNames(this)) {
                let flag = this[key];

                if (!key.match(ENUMERATION_FLAG_NAME_PATTERN)) continue;

                if (typeof flag === "number")
                    yield new KeyValuePair(key, flag);
            }
        }

        return new Dictionary(...createFlagKeyValuePairs.call(this));
    }
}