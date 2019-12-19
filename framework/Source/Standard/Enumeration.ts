import { ArgumentTypeException, FormatException, InvalidTypeException, InvalidOperationException, KeyNotFoundException } from "./Exceptions";
import { mapUtils } from "../Utils/utils";

const ENUMERATION_FLAG_NAME_PATTERN = /^[A-Z]\w*$/;

export type EnumerationValue = number | string | boolean | bigint;
export type EnumerationDescriptor<T> = Array<string> | { [key: string]: T };

function splitSetString(setStr: string): string[] {
    return setStr.split("\s*,\s*");
}

function joinIntoSetStr(strs: string[]): string {
    return strs.join(", ");
}

function setContainsString(str: string, setStr: string): boolean {
    const setStrs: string[] = splitSetString(setStr);
    return setStrs.indexOf(str) !== -1;
}

function* getEnumerationFlags<T = EnumerationValue>(descriptor: EnumerationDescriptor<T>) {
    if (typeof descriptor != "object")
        return;

    if (<any>descriptor instanceof Object) {
        for (let key in descriptor)
            yield { key, value: descriptor[key] };
    }
    else if (<any>descriptor instanceof Array) {
        for (let i = 0; i < (<[]>descriptor).length; i++)
            yield { key: descriptor[i], value: i }
    }
}

function inferEnumerationTypeFromValue<T = EnumerationValue>(value: T): number {
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
    if (inferEnumerationTypeFromValue(value) === enumerationType)
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
        if (!typeMatchesEnumerationType(flag, this.__type))
            throw new ArgumentTypeException("flag", typeof flag);
        if (!typeMatchesEnumerationType(value, this.__type))
            throw new ArgumentTypeException("value", typeof value);

        if (this.__type == Enumeration.TYPE_NUMBER || this.__type == Enumeration.TYPE_BIGINT)
            return (<number><unknown>value & <number><unknown>flag) == <number><unknown>flag;
        else if (this.__type == Enumeration.TYPE_STRING)
            return setContainsString(<string><unknown>flag, <string><unknown>value);
    }

    constructor(descriptor: string[] | { [key: string]: T }) {
        for (let { key, value } of getEnumerationFlags(descriptor)) {
            if (typeof key === "string") {
                if (!key.match(ENUMERATION_FLAG_NAME_PATTERN))
                    throw new FormatException("EnumerationFlag", key)
            }

            const type = inferEnumerationTypeFromValue(value);
            if (type === null)
                throw new InvalidTypeException(`descriptor[${key}]`, typeof value, ["number", "string", "bool", "bigint"])
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
            })
        }
    }

    toString(value: T) {
        function toString_number(this: Enumeration<T>): number {
            function convertExact(this: Enumeration<T>): string {
                return mapUtils.invert(this.__flagsMap).get(value);
            }

            function convertMultiple(this: Enumeration<T>): string {
                let flagStrs: string[] = [];

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

        function toString_string(this: Enumeration<T>) {
            const result = [];
            const valuesMap = mapUtils.invert(this.__flagsMap);
            const valueItems = splitSetString(<string><unknown>value);
            for (let valueItem of valueItems) {
                let flag = valuesMap.get(<T><unknown>valueItem);
                if (flag === undefined)
                    throw new KeyNotFoundException(`Value ${valueItem} does not exist in Enumeration ${this.constructor.name}.`);

                result.push(flag);
            }
            return result;
        }

        function toString_boolean(this: Enumeration<T>) {
            let result = mapUtils.invert(this.__flagsMap).get(value);
            if (result !== undefined)
                return result;

            throw new KeyNotFoundException(`Value ${value} does not exist in Enumeration ${this.constructor.name}.`);
        }

        if (!typeMatchesEnumerationType(value, this.__type))
            throw new ArgumentTypeException("value", typeof value);

        if (this.__type == Enumeration.TYPE_NUMBER || this.__type == Enumeration.TYPE_BIGINT)
            return toString_number.call(this);
        else if (this.__type == Enumeration.TYPE_STRING)
            return toString_string.call(this);
        else if (this.__type == Enumeration.TYPE_BOOLEAN)
            return toString_boolean.call(this);
    }

    parse(value) {
        function parse_number(this: Enumeration<T>): number {
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

        function parse_string(this: Enumeration<T>): string {
            const result: string = this[value];
            if (result !== undefined)
                return result;

            throw new KeyNotFoundException(`Key ${value} does not exist in Enumeration ${this.constructor.name}.`);
        }

        function parse_boolean(this: Enumeration<T>): boolean {
            const result = this.__flagsMap.get(value);
            if (result !== undefined)
                return <boolean><unknown>result;

            throw new KeyNotFoundException(`Key ${value} does not exist in Enumeration ${this.constructor.name}.`);
        }

        if (typeof value !== "string")
            throw new ArgumentTypeException("value", typeof value);

        if (this.__type == Enumeration.TYPE_NUMBER || this.__type == Enumeration.TYPE_BIGINT)
            return parse_number.call(this);
        else if (this.__type == Enumeration.TYPE_STRING)
            return parse_string.call(this);
        else if (this.__type == Enumeration.TYPE_BOOLEAN)
            return parse_boolean.call(this);
    }

    private __type: number;
    private __flagsMap: Map<string, T>;
}