import { ArrayUtils } from "../../core-base/utils/index.js";
import { FormatException } from "../exceptions/index.js";
import { OutputArgument } from "../reflection/types.js";
import { StringReader } from "../strings/string-reader.js";
import { Guid } from "./index.js";

export namespace __StringConverter {
    export function convertGuidToString(guid: Guid, format: string): string {
        const bytes: number[] = Array.from(guid.buffer);
        switch (format) {
            case "N":
                return convertBytesToFormattedString(bytes, N_MASK);
            case null:
            case "":
            case "D":
                return convertBytesToFormattedString(bytes, D_MASK);
            case "B":
                return convertBytesToFormattedString(bytes, B_MASK);
            case "P":
                return convertBytesToFormattedString(bytes, P_MASK);
            case "X":
                return convertBytesToFormattedString(bytes, X_MASK);
            default:
                throw new FormatException("N, D, B, P, X");
        }

        function convertBytesToFormattedString(bytes: number[], mask: string): string {
            return maskString(bytesToString(bytes), mask);

            function maskString(str: string, mask: string) {
                let maskedString = "";
                const maskStringReader = new StringReader(mask);
                const stringIterator = str[Symbol.iterator]();
                while (!maskStringReader.isEOF) {
                    const co = maskStringReader.read();
                    if (co != "0" || maskStringReader.peek() == "x") {
                        maskedString += co!;
                        continue;
                    }
                    const sir = stringIterator.next();
                    maskedString += sir.value;
                }
                if(stringIterator.return)
                    stringIterator.return();
                return maskedString;
            }

            function bytesToString(bytes: number[]): string {
                return bytes.flatMap(b => byteToNibbles(b)).map(n => nibbleToChar(n)).join("");
            }

            function byteToNibbles(byte: number) {
                return [(byte >> 4) & 0xF, byte & 0xF];
            }

            function nibbleToChar(nibble: number) {
                return nibble.toString(16);
            }
        }
    }

    export function tryConvertStringToGuid(str: string, outGuid: OutputArgument<Guid>): boolean {
        const outBytes: OutputArgument<number[]> = {};
        if (!tryConvertFormattedStringToBytes(N_MASK) &&
            !tryConvertFormattedStringToBytes(D_MASK) &&
            !tryConvertFormattedStringToBytes(P_MASK) &&
            !tryConvertFormattedStringToBytes(B_MASK) &&
            !tryConvertFormattedStringToBytes(X_MASK))
            return false;
        outGuid.value = new Guid(new Uint8Array(outBytes.value!));
        return true;

        function tryConvertFormattedStringToBytes(mask: string): boolean {
            const outUnmaskedString: OutputArgument<string> = {};
            if (!tryUnmaskString(outUnmaskedString))
                return false;
            outBytes.value = stringToBytes(outUnmaskedString.value!);
            return true;

            function tryUnmaskString(outUnmaskedString: OutputArgument<string>): boolean {
                let unmaskedString = "";
                const maskStrReader = new StringReader(mask);
                const strIterator = str[Symbol.iterator]();
                while (!maskStrReader.isEOF) {
                    const stringIteratorResult = strIterator.next();
                    if (stringIteratorResult.done)
                        return false;
                    const maskChar = maskStrReader.read();
                    if (maskChar != "0" || maskStrReader.peek() == "x")
                        continue;
                    if (!stringIteratorResult.value!.match(/[0-9a-f]/))
                        return false;
                    unmaskedString += stringIteratorResult.value;
                }
                if (strIterator.return)
                    strIterator.return();
                outUnmaskedString.value = unmaskedString;
                return true;
            }

            function stringToBytes(str: string): number[] {
                return Array.from(ArrayUtils.selectChunks(ArrayUtils.select(str, c => charToNibble(c)), 2, ws => nibblesToByte(ws)));
            }

            function charToNibble(char: string) {
                return Number.parseInt(char, 16);
            }

            function nibblesToByte(nibbles: number[]) {
                return nibbles[0] << 4 | nibbles[1];
            }
        }
    }
}

const N_MASK = "0".repeat(32);

const D_MASK = [8, 4, 4, 4, 12].map(l => "0".repeat(l)).join("-");

const P_MASK = `(${D_MASK})`;

const B_MASK = `{${D_MASK}}`;

const X_MASK = `{${[8, 4, 4, [2, 2, 2, 2, 2, 2, 2, 2]].flatMap(l => typeof l == "number" ? "0x" + "0".repeat(l) : `{${l.map(m => "0x" + "0".repeat(m))}}`)}}`;