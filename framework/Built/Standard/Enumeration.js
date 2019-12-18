import { ArgumentTypeException, InvalidTypeException, InvalidOperationException, KeyNotFoundException } from "./Exceptions";
const ENUMERATION_FLAG_NAME_PATTERN = /^[A-Z]\w*$/;
function setContainsString(str, setStr) {
    const strs = setStr.split("\s*,\s*");
    return strs.indexOf(str) !== -1;
}
function* getEnumerationFlags(descriptor) {
    if (typeof descriptor != "object")
        return;
    if (descriptor instanceof Object) {
        for (let key in descriptor)
            yield { key, value: descriptor[key] };
    }
    else if (descriptor instanceof Array) {
        for (let i = 0; i < descriptor.length; i++)
            yield { key: descriptor[i], value: i };
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
        case "bigint":
            return Enumeration.TYPE_BIGINT;
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
            const type = inferEnumerationTypeFromValue(value);
            if (type === null)
                throw new InvalidTypeException(`descriptor[${key}]`, typeof value, ["number", "string", "bool", "bigint"]);
            else if (this.__type === undefined)
                this.__type = type;
            else if (this.__type !== type)
                throw new InvalidOperationException("The provided descriptor contains values of mixed types.");
            if (this.__flags.has(key))
                throw new InvalidOperationException("The provided descriptor contains duplicated flag definitions.");
            this.__flags.set(key, value);
        }
    }
    static get TYPE_NUMBER() { return 0; }
    static get TYPE_STRING() { return 1; }
    static get TYPE_BOOLEAN() { return 2; }
    static get TYPE_BIGINT() { return 3; }
    contains(flag, value) {
        if (!typeMatchesEnumerationType(flag, this.__type))
            throw new ArgumentTypeException("flag", "number");
        if (!typeMatchesEnumerationType(value, this.__type))
            throw new ArgumentTypeException("value", "number");
        if (this.__type == Enumeration.TYPE_NUMBER ||
            this.__type == Enumeration.TYPE_BIGINT)
            return (value & flag) == flag;
        else if (this.__type == Enumeration.TYPE_STRING)
            return setContainsString(flag, value);
    }
    toString(value) {
        function toString_number() {
            function convertExact() {
                let result = this.__flags.get(value);
                if (result !== undefined)
                    return result;
                return undefined;
            }
            function convertMultiple() {
                let flagStrs = [];
                for (let item of this.__flags) {
                    if (this.contains(item[1], value))
                        flagStrs.push(item[0]);
                }
                return flagStrs.join(", ");
            }
            if (typeof value !== "number")
                throw new ArgumentTypeException("value");
            const result = convertExact.call(this) || convertMultiple.call(this);
            if (result !== undefined)
                return result;
            throw ;
        }
        function toString_string() {
            if (typeof value !== "string")
                throw new ArgumentTypeException("value");
            const flag = __flags.get(value);
            if (flag !== undefined)
                return flag;
            throw ;
        }
        if (this.__type == Enumeration.TYPE_NUMBER)
            return toString_number();
        else if (this.__type == Enumeration.TYPE_STRING)
            return toString_string();
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
        if (typeof value !== "string")
            throw new ArgumentTypeException("value");
        if (this.__type == Enumeration.TYPE_NUMBER)
            return parse_number();
        else if (this.__type == Enumeration.TYPE_STRING)
            return parse_string();
    }
}
