import { ArgumentTypeException, FormatException, InvalidTypeException, InvalidOperationException, KeyNotFoundException } from "./Exceptions";

const ENUMERATION_FLAG_NAME_PATTERN = /^[A-Z]\w*$/;

function setContainsString(str: string, setStr: string) {
    const strs: string[] = setStr.split("\s*,\s*");
    return strs.indexOf(str) !== -1;
}

export type EnumerationValue = number | string | boolean | bigint;
export type EnumerationDescriptor<T> = Array<string> | { [key: string]: T };

function* getEnumerationFlags<T = EnumerationValue>(descriptor: EnumerationDescriptor<T>) {
    if (typeof descriptor != "object")
        return;

    if (<any>descriptor instanceof Object) {
        for (let key in descriptor)
            yield { key, value: descriptor[key] };
    }
    else if (<any>descriptor instanceof Array) {
        for (let i = 0; i < (<[]>descriptor).length; i++)
            yield { key: i, value: descriptor[i] }
    }
}

function getEnumerationTypeFromValue<T = EnumerationValue>(value: T): number {
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

function typeMatchesEnumerationType<T = EnumerationValue>(value: T, enumerationType: number): boolean {
    if (getEnumerationTypeFromValue(value) === enumerationType)
        return true;
    return false;
}

/**
 * Enumeration Class
 * Represents an enumeration of options.
 */
export class Enumeration<T = EnumerationValue> {
    static get TYPE_NUMBER() { return 0 }
    static get TYPE_STRING() { return 1 }
    static get TYPE_BOOLEAN() { return 2 }
    static get TYPE_BIGINT() { return 3 }

    contains(flag: T, value: T): boolean {
        if (this.__valueType == Enumeration.TYPE_NUMBER) {
            if (typeof flag !== "number")
                throw new ArgumentTypeException("flag", "number");
            if (typeof value !== "number")
                throw new ArgumentTypeException("value", "number");

            return (value & flag) == flag;
        }
        else if (this.__type == Enumeration.TYPE_STRING) {
            if (typeof flag !== "string")
                throw new ArgumentTypeException("flag", "string");
            else if (typeof flag !== "string")
                throw new ArgumentTypeException("value", "string");

            return setContainsString(<string><unknown>flag, <string><unknown>value);
        }
    }

    constructor(descriptor: string[] | { [key: string]: T }) {
        for (let { key, value } of generateFlagsFromDescriptor(descriptor)) {
        }
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