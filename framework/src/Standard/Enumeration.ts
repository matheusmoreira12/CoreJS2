import { ArgumentTypeException, FormatException, InvalidOperationException, KeyNotFoundException } from "./Exceptions";
import { MapUtils } from "../CoreBase/Utils/index";

const ENUMERATION_FLAG_NAME_PATTERN = /^[A-Z]\w*$/;

type ExplicitEnumerationDescriptor = { [key: string]: number };
type ImplicitEnumerationDescriptor = string[];

export type EnumerationDescriptor = ExplicitEnumerationDescriptor | ImplicitEnumerationDescriptor;

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

function* getEnumerationFlags(descriptor: EnumerationDescriptor): Generator<{ key: string, value: number }> {
    if (typeof descriptor != "object")
        throw new ArgumentTypeException("descriptor", typeof descriptor, "object");

    if (<any>descriptor instanceof Array) {
        for (let i = 0; i < (<ImplicitEnumerationDescriptor>descriptor).length; i++)
            yield { key: (<ImplicitEnumerationDescriptor>descriptor)[i], value: <number><unknown>i }
    }
    else {
        for (let key in descriptor)
            yield { key, value: (<ExplicitEnumerationDescriptor>descriptor)[key] };
    }
}

/**
 * Enumeration Class
 * Represents an enumeration of options.
 */
export class Enumeration {
    static contains(flag: number, value: number): boolean {
        if (typeof flag != "number")
            throw new ArgumentTypeException("flag", flag, Number);
        if (typeof value != "number")
            throw new ArgumentTypeException("value", value, Number);

        return (value & flag) == flag;
    }

    constructor(descriptor: EnumerationDescriptor) {
        this.__flagsMap = new Map();

        for (let { key, value } of getEnumerationFlags(descriptor)) {
            if (!key.match(ENUMERATION_FLAG_NAME_PATTERN))
                throw new FormatException("EnumerationFlag", key)

            if (this.__flagsMap.has(key))
                throw new InvalidOperationException("The provided descriptor contains duplicated flag definitions.");
            this.__flagsMap.set(key, value);

            Object.defineProperty(this, key, {
                get() { return this.__flagsMap.get(key); }
            })
        }
    }

    getLabel(value: number): string | null {
        function convertExact(this: Enumeration): string | undefined {
            return MapUtils.invert(this.__flagsMap).get(value);
        }

        function convertMultiple(this: Enumeration): string {
            let flagStrs: string[] = [];

            for (let item of this.__flagsMap) {
                if (item[1] != 0 && Enumeration.contains(item[1], value))
                    flagStrs.push(item[0]);
            }

            return joinIntoSetStr(flagStrs);
        }

        const result = convertExact.call(this) || convertMultiple.call(this);
        if (result !== undefined)
            return result;

        throw new InvalidOperationException("Cannot convert Enumeration value to String. The specified value is not valid.");
    }

    fromLabel(label: string): number {
        let result: number = 0;

        let flags = label.split(/\s*,\s*/);
        for (let flag of flags) {
            let value: number = <number><unknown>this[<keyof this>flag];
            if (value === undefined)
                throw new KeyNotFoundException(`Key ${flag} does not exist in Enumeration ${this.constructor.name}.`);

            result |= value;
        }

        return result;
    }

    private __flagsMap: Map<string, number>;
}