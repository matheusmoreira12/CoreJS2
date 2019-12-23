import { ArgumentTypeException, FormatException, InvalidTypeException, InvalidOperationException, KeyNotFoundException } from "./Exceptions";
import { MapUtils } from "../Utils/utils";
const ENUMERATION_FLAG_NAME_PATTERN = /^[A-Z]\w*$/;
function splitSetString(setStr) {
    return setStr.split("\s*,\s*");
}
function joinIntoSetStr(strs) {
    return strs.join(", ");
}
function setContainsString(str, setStr) {
    const setStrs = splitSetString(setStr);
    return setStrs.indexOf(str) !== -1;
}
function* getEnumerationFlags(descriptor) {
    if (typeof descriptor != "object")
        throw new ArgumentTypeException("descriptor", typeof descriptor, "object");
    if (descriptor instanceof Array) {
        for (let i = 0; i < descriptor.length; i++)
            yield { key: descriptor[i], value: i };
    }
    else {
        for (let key in descriptor)
            yield { key, value: descriptor[key] };
    }
}
function inferEnumerationTypeFromValue(value) {
    switch (typeof value) {
        case "number":
            return Enumeration.TYPE_NUMBER;
        case "string":
            return Enumeration.TYPE_STRING;
        case "boolean":
            return Enumeration.TYPE_BOOLEAN;
    }
    return null;
}
function typeMatchesEnumerationType(value, enumerationType) {
    if (inferEnumerationTypeFromValue(value) === enumerationType)
        return true;
    return false;
}
/**
 * Enumeration Class
 * Represents an enumeration of options.
 */
export class Enumeration {
    constructor(descriptor) {
        for (let { key, value } of getEnumerationFlags(descriptor)) {
            if (typeof key === "string") {
                if (!key.match(ENUMERATION_FLAG_NAME_PATTERN))
                    throw new FormatException("EnumerationFlag", key);
            }
            const type = inferEnumerationTypeFromValue(value);
            if (type === null)
                throw new InvalidTypeException(`descriptor[${key}]`, typeof value, ["number", "string", "bool", "bigint"]);
            else {
                if (this.__type === undefined)
                    this.__type = type;
                else if (this.__type !== type)
                    throw new InvalidOperationException("The provided descriptor contains values of mixed types.");
            }
            if (this.__flagsMap.has(key))
                throw new InvalidOperationException("The provided descriptor contains duplicated flag definitions.");
            this.__flagsMap.set(key, value);
            Object.defineProperty(this, key, {
                get() { return this.__flagsMap.get(key); }
            });
        }
    }
    static get TYPE_NUMBER() { return 0; }
    static get TYPE_STRING() { return 1; }
    static get TYPE_BOOLEAN() { return 2; }
    contains(flag, value) {
        if (!typeMatchesEnumerationType(flag, this.__type))
            throw new ArgumentTypeException("flag", typeof flag);
        if (!typeMatchesEnumerationType(value, this.__type))
            throw new ArgumentTypeException("value", typeof value);
        if (this.__type == Enumeration.TYPE_NUMBER)
            return (value & flag) == flag;
        else if (this.__type == Enumeration.TYPE_STRING)
            return setContainsString(flag, value);
    }
    toString(value) {
        function toString_number() {
            function convertExact() {
                return MapUtils.invert(this.__flagsMap).get(value);
            }
            function convertMultiple() {
                let flagStrs = [];
                for (let item of this.__flagsMap) {
                    if (this.contains(item[1], value))
                        flagStrs.push(item[0]);
                }
                return joinIntoSetStr(flagStrs);
            }
            const result = convertExact.call(this) || convertMultiple.call(this);
            if (result !== undefined)
                return result;
            throw new InvalidOperationException("Cannot convert Enumeration value to String. The specified value is not valid.");
        }
        function toString_string() {
            const result = [];
            const valuesMap = MapUtils.invert(this.__flagsMap);
            const valueItems = splitSetString(value);
            for (let valueItem of valueItems) {
                let flag = valuesMap.get(valueItem);
                if (flag === undefined)
                    throw new KeyNotFoundException(`Value ${valueItem} does not exist in Enumeration ${this.constructor.name}.`);
                result.push(flag);
            }
            return result;
        }
        function toString_boolean() {
            let result = MapUtils.invert(this.__flagsMap).get(value);
            if (result !== undefined)
                return result;
            throw new KeyNotFoundException(`Value ${value} does not exist in Enumeration ${this.constructor.name}.`);
        }
        if (!typeMatchesEnumerationType(value, this.__type))
            throw new ArgumentTypeException("value", typeof value);
        if (this.__type == Enumeration.TYPE_NUMBER)
            return toString_number.call(this);
        else if (this.__type == Enumeration.TYPE_STRING)
            return toString_string.call(this);
        else if (this.__type == Enumeration.TYPE_BOOLEAN)
            return toString_boolean.call(this);
    }
    parse(value) {
        function parse_number() {
            let result = 0;
            let flags = value.split(/\s*,\s*/);
            for (let flag of flags) {
                let value = this[flag];
                if (value === undefined)
                    throw new KeyNotFoundException(`Key ${flag} does not exist in Enumeration ${this.constructor.name}.`);
                if (this.__type == Enumeration.TYPE_NUMBER)
                    result |= value;
            }
            return result;
        }
        function parse_string() {
            const result = this[value];
            if (result !== undefined)
                return result;
            throw new KeyNotFoundException(`Key ${value} does not exist in Enumeration ${this.constructor.name}.`);
        }
        function parse_boolean() {
            const result = this.__flagsMap.get(value);
            if (result !== undefined)
                return result;
            throw new KeyNotFoundException(`Key ${value} does not exist in Enumeration ${this.constructor.name}.`);
        }
        if (typeof value !== "string")
            throw new ArgumentTypeException("value", typeof value);
        if (this.__type == Enumeration.TYPE_NUMBER)
            return parse_number.call(this);
        else if (this.__type == Enumeration.TYPE_STRING)
            return parse_string.call(this);
        else if (this.__type == Enumeration.TYPE_BOOLEAN)
            return parse_boolean.call(this);
    }
}
