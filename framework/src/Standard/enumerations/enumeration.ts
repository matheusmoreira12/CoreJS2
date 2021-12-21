import { ArgumentTypeException, FormatException, InvalidOperationException, KeyNotFoundException, InvalidTypeException } from "../exceptions/index.js";
import { MapUtils } from "../../core-base/utils/index.js";

import * as _Registry from "./_registry.js";
import { InstanceOf } from "../reflection/index.js";

export type EnumerationDescriptor = { [key: string]: number | null };

type EnumerationFlags<TDesc extends EnumerationDescriptor> = {
    readonly [P in keyof TDesc]: InstanceOf<EnumerationInstance<TDesc>>;
}

export type EnumerationInstance<TDesc extends EnumerationDescriptor> = typeof Enumeration & EnumerationFlags<TDesc> & {
    getFor(value: number): InstanceOf<EnumerationInstance<TDesc>>;
};

const ENUMERATION_FLAG_NAME_PATTERN = /^[A-Z]\w*$/;

function splitSetString(setStr: string): string[] {
    return setStr.split("\s*,\s*");
}

function joinIntoSetStr(strs: string[]): string {
    return strs.join(", ");
}

function* getEnumerationFlags(descriptor: EnumerationDescriptor): Generator<{ key: string, value: number }> {
    if (typeof descriptor != "object")
        throw new ArgumentTypeException("descriptor", typeof descriptor, "object");

    let value: number = -1;
    for (let key of Object.getOwnPropertyNames(descriptor)) {
        if (descriptor[key] === null)
            value++;
        else
            value = <number>descriptor[key];

        yield { key, value };
    }
}

/**
 * Enumeration Class
 * Represents an enumeration of options.
 */
export class Enumeration extends null {
    static create<TDesc extends EnumerationDescriptor>(descriptor: TDesc): EnumerationInstance<TDesc> {
        const EnumerationInstance: typeof Enumeration = Object.create(Enumeration);
        Object.defineProperty(EnumerationInstance.prototype, "getFor", function (value: number) {
            const flag: Enumeration = Object.create(EnumerationInstance.prototype);
            Object.defineProperty(flag, Symbol.toPrimitive, function () {
                return value;
            });
            return flag;
        });
        for (let { key, value } of getEnumerationFlags(descriptor)) {
            if (typeof key !== "string")
                throw new InvalidTypeException("key", key, String);
            if (!key.match(ENUMERATION_FLAG_NAME_PATTERN))
                throw new FormatException("EnumerationFlag", key);
            if (typeof value !== "number")
                throw new InvalidTypeException("value", value, Number);
            const flag: typeof Enumeration = Object.create(EnumerationInstance.prototype);
            Object.defineProperty(flag, Symbol.toPrimitive, () => value);
            Object.defineProperty(EnumerationInstance, key, {
                get() { return flag; }
            });
        }
        return Object.create(EnumerationInstance.prototype);
    }

    static contains(flag: number, value: number): boolean {
        if (typeof flag != "number")
            throw new ArgumentTypeException("flag", flag, Number);
        if (typeof value != "number")
            throw new ArgumentTypeException("value", value, Number);

        return (value & flag) == flag;
    }

    [Symbol.toPrimitive]: () => number;
}