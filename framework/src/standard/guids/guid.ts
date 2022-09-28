import { ArrayUtils } from "../../core-base/utils/array-utils.js";
import { StringUtils } from "../../core-base/utils/string-utils.js";
import { assertParams } from "../../validation/index.js";
import { ArgumentException, FormatException } from "../exceptions/framework-exception.js";
import { OutputArgument } from "../reflection/types.js";
import { __Generator } from "./__generator.js";
import { __StringConverter } from "./__string-converter.js";

export class Guid {
    static createUnique(): Guid {
        return __Generator.createUnique();
    }

    static create(): Guid {
        return __Generator.create();
    }

    static tryParse(str: string, outGuid: OutputArgument<Guid>): boolean {
        assertParams({ str }, [String, null]);

        return __StringConverter.tryConvertStringToGuid(str, outGuid);
    }

    static parse(str: string) {
        assertParams({ str }, [String]);

        const outGuid: OutputArgument<Guid> = {};
        if (this.tryParse(str, outGuid))
            return outGuid.value!;
        throw new FormatException();
    }

    constructor(buffer: Uint8Array) {
        assertParams({ buffer }, [Uint8Array]);
        assertBufferLength(buffer);

        this.__buffer = buffer;
    }

    equals(other: object): boolean {
        if (other instanceof Guid)
            return ArrayUtils.sequenceEqual(this.buffer, other.buffer);
        return false;
    }

    [Symbol.toStringTag](): string {
        return `${this.toString}`;
    }

    toString(format = "D"): string {
        return __StringConverter.convertGuidToString(this, format);
    }

    get buffer(): Uint8Array { return this.__buffer; }
    private __buffer: Uint8Array;
}

function assertBufferLength(buffer: Uint8Array) {
    if (buffer.length != 16)
        throw new ArgumentException(StringUtils.nameOf({ bytes: buffer }), "Invalid buffer. A length of 16 was expected.");
}