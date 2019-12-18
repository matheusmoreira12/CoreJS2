import { ArgumentTypeException, FormatException, InvalidTypeException, InvalidOperationException, KeyNotFoundException } from "./Exceptions";

const ENUMERATION_FLAG_NAME_PATTERN = /^[A-Z]\w*$/;

/**
 * Enumeration Class
 * Represents an enumeration of options.
 */
export class Enumeration<T = number | string> {
    static get TYPE_NUMBER() { return 0 }
    static get TYPE_STRING() { return 1 }

    contains(flag: T, value: T): boolean {
        function contains_string(): boolean {
            const flags: string[] = (<string><unknown>value).split(/,\s*/g)
            return flags.includes()
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

    constructor(descriptor: string[] | { [key: string]: T }) {
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

                const value = descriptor[key],
                    valueType = typeof value;

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

    toString(value: T) {
        function toString_number(this: Enumeration<T>): number {
            function convertExact(this: Enumeration<T>): number {
                let result: T = this.__flags.get(<string><unknown>value);
                if (result !== undefined)
                    return result;

                return undefined;
            }

            function convertMultiple(this: Enumeration<T>): number {
                let flagStrs: string[] = [];

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

        function toString_string(this: Enumeration<T>) {
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
        function parse_number(): number {
            let result: number = 0;

            let flags = value.split(/\s*,\s*/);
            for (let flag of flags) {
                let value: T = this[flag];
                if (value === undefined)
                    throw new KeyNotFoundException(`Key ${flag} does not exist in Enumeration ${this.constructor.name}.`);

                if (this.__type == Enumeration.TYPE_NUMBER)
                    result |= <number><unknown>value;
            }

            return result;
        }

        function parse_string(): string {
            const result: string = this[value];
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

    private __type: number;
    private __flags: Map<string, T>;
}