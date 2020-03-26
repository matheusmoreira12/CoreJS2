import { ArgumentTypeException, FormatException, InvalidOperationException, KeyNotFoundException, InvalidTypeException } from "./Exceptions";
import { MapUtils } from "../CoreBase/Utils/index";

export type EnumerationDescriptor = { [key: string]: number | null };

export type EnumerationInstance<TDesc extends EnumerationDescriptor> = Enumeration & {
    readonly [P in keyof TDesc]: number;
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
    for (let key in descriptor) {
        if (descriptor[key] === null)
            value++;
        else
            value = <number>descriptor[key];

        yield { key, value };
    }
}

const $flags = Symbol("flags");

/**
 * Enumeration Class
 * Represents an enumeration of options.
 */
export class Enumeration {
    static create<TDesc extends EnumerationDescriptor>(descriptor: TDesc): EnumerationInstance<TDesc> {
        const flags = new Map<string, number>();
        for (let { key, value } of getEnumerationFlags(descriptor)) {
            if (typeof key !== "string")
                throw new InvalidTypeException("key", key, String);
            if (!key.match(ENUMERATION_FLAG_NAME_PATTERN))
                throw new FormatException("EnumerationFlag", key);
            if (typeof value !== "number")
                throw new InvalidTypeException("value", value, Number);

            flags.set(key, value);
        }
        return <EnumerationInstance<TDesc>>new Enumeration(flags);
    }

    static contains(flag: number, value: number): boolean {
        if (typeof flag != "number")
            throw new ArgumentTypeException("flag", flag, Number);
        if (typeof value != "number")
            throw new ArgumentTypeException("value", value, Number);

        return (value & flag) == flag;
    }

    private constructor(flags: Map<string, number>) {
        for (const flag of flags) {
            Object.defineProperty(this, flag[0], {
                get() { return flags.get(flag[0]); }
            });
        }

        this[$flags] = flags;
    }

    assertFlag(flag: number) {
        const flagsInverted = MapUtils.invert(this[$flags]);
        if (flagsInverted.get(flag) === undefined)
            throw new KeyNotFoundException("The specified flag cannot be found in enumeration.");
    }

    getLabel(value: number): string | null {
        function convertExact(this: Enumeration): string | undefined {
            return MapUtils.invert(this[$flags]).get(value);
        }

        function convertMultiple(this: Enumeration): string {
            let flagStrs: string[] = [];

            for (let item of this[$flags]) {
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

        let flags = splitSetString(label);
        for (let flag of flags) {
            let value: number = <number><unknown>this[<keyof this>flag];
            if (value === undefined)
                throw new KeyNotFoundException(`Key ${flag} does not exist in Enumeration ${this.constructor.name}.`);

            result |= value;
        }

        return result;
    }

    private [$flags]: Map<string, number>;
}