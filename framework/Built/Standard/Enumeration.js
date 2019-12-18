import { ArgumentTypeException, FormatException, InvalidTypeException, KeyNotFoundException } from "./Exceptions";
const ENUMERATION_FLAG_NAME_PATTERN = /^[A-Z]\w*$/;
/**
 * Enumeration Class
 * Represents an enumeration of options.
 */
export class Enumeration {
    constructor(descriptor) {
        function addFlag(name, value) {
            Object.defineProperty(this, name, {
                get() { return value; }
            });
        }
        if (descriptor instanceof Array) {
            for (let i = 0; i < descriptor.length; i++)
                addFlag.call(this, descriptor[i], i);
        }
        else if (descriptor instanceof Object)
            for (let key in descriptor) {
                if (!key.match(ENUMERATION_FLAG_NAME_PATTERN))
                    throw new FormatException("FlagName", key);
                const value = descriptor[key], valueType = typeof value;
                if (this.__valueType === null)
                    this.__valueType = valueType;
                else if (valueType == "string" || valueType == "number")
                    throw new InvalidTypeException(`descriptor[${key}]`, valueType, ["string", "number"]);
                else if (this.__valueType !== valueType)
                    throw new InvalidTypeException(`descriptor[${key}]`, valueType, this.__valueType, "The provided descriptor has inconsistent flag types.");
                addFlag.call(this, key, value);
            }
        else
            throw new ArgumentTypeException("map", [Array, Object]);
    }
    static get TYPE_NUMBER() { return 0; }
    static get TYPE_STRING() { return 1; }
    contains(flag, value) {
        function contains_string() {
            const flags = value.split(/,\s*/g);
            return flags.includes();
        }
        if (this.__valueType == "number") {
            if (typeof flag !== "number")
                throw new ArgumentTypeException("flag", "number");
            if (typeof value !== "number")
                throw new ArgumentTypeException("value", "number");
            return (value & flag) == flag;
        }
        else if (this.__valueType == "string") {
            if (typeof flag !== "string")
                throw new ArgumentTypeException("flag", "string");
            else if (typeof flag !== "string")
                throw new ArgumentTypeException("value", "string");
            return contains_string();
        }
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
