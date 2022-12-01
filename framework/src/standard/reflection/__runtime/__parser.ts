import { StringReader } from "../../strings/index.js";
import { MethodInfoBase, ParameterInfo } from "../index.js";
import { OutputArgument } from "../types.js";

export module __Parser {
    export function tryParseMethodParameters(method: MethodInfoBase, bodyStr: string, outParameters: OutputArgument<ParameterInfo[]>): boolean {
        return tryParseAsyncArrow() ||
            tryParseArrow() ||
            tryParseAsyncGeneratorNamed() ||
            tryParseGeneratorNamed() ||
            tryParseAsyncNamed() ||
            tryParseNamed() ||
            tryParseAnonymous();

        function tryParseAsyncArrow(): boolean {
            const reader = new StringReader(bodyStr);
            return tryReadString(reader, "async") &&
                skipBlankSpace(reader) &&
                tryReadArrow(reader, outParameters);
        }

        function tryParseArrow(): boolean {
            const reader = new StringReader(bodyStr);
            return tryReadArrow(reader, outParameters);
        }

        function tryReadArrow(reader: StringReader, outParameters: OutputArgument<ParameterInfo[]>): boolean {
            return tryReadParameters(reader, outParameters) &&
                skipBlankSpace(reader) &&
                tryReadString(reader, "=>");
        }

        function tryParseAsyncGeneratorNamed(): boolean {
            const reader = new StringReader(bodyStr);
            return tryReadString(reader, "async") &&
                tryReadBlankSpace(reader) &&
                tryReadGeneratorNamed(reader, outParameters);
        }

        function tryParseGeneratorNamed(): boolean {
            const reader = new StringReader(bodyStr);
            return tryReadGeneratorNamed(reader, outParameters);
        }

        function tryReadGeneratorNamed(reader: StringReader, outParameters: OutputArgument<ParameterInfo[]>): boolean {
            return tryReadString(reader, "function") &&
                skipBlankSpace(reader) &&
                tryReadString(reader, "*") &&
                skipBlankSpace(reader) &&
                tryReadIdentifier(reader) &&
                skipBlankSpace(reader) &&
                tryReadParameters(reader, outParameters) &&
                skipBlankSpace(reader) &&
                tryReadString(reader, "{");
        }

        function tryParseAsyncNamed(): boolean {
            const reader = new StringReader(bodyStr);
            return tryReadString(reader, "async") &&
                tryReadBlankSpace(reader) &&
                tryReadNamed(reader, outParameters);
        }

        function tryParseNamed(): boolean {
            const reader = new StringReader(bodyStr);
            return tryReadNamed(reader, outParameters);
        }

        function tryReadNamed(reader: StringReader, outParameters: OutputArgument<ParameterInfo[]>): boolean {
            return tryReadString(reader, "function") &&
                tryReadBlankSpace(reader) &&
                tryReadIdentifier(reader) &&
                skipBlankSpace(reader) &&
                tryReadParameters(reader, outParameters) &&
                skipBlankSpace(reader) &&
                tryReadString(reader, "{");
        }

        function tryParseAnonymous(): boolean {
            const reader = new StringReader(bodyStr);
            return tryReadString(reader, "function") &&
                skipBlankSpace(reader) &&
                tryReadParameters(reader, outParameters) &&
                skipBlankSpace(reader) &&
                tryReadString(reader, "{");
        }

        function tryReadString(reader: StringReader, str: string): boolean {
            const rcs = new Array(str.length);
            const l = str.length;
            return reader.readBlock(rcs, 0, l) == l && rcs.join("") == str;
        }

        function tryReadIdentifier(reader: StringReader, outIdentifier: OutputArgument<string> = {}): boolean {
            let r = "";
            while (/[a-zA-Z$]/.test(reader.peek() ?? ""))
                reader.skip();
            return r != "";
        }

        function skipBlankSpace(reader: StringReader) {
            tryReadBlankSpace(reader);
            return true;
        }

        function tryReadBlankSpace(reader: StringReader): boolean {
            const start = reader.position;
            while (/\s/.test(reader.peek() ?? ""))
                reader.skip();
            return reader.position > start;
        }

        function tryReadParameters(reader: StringReader, outParameters: OutputArgument<ParameterInfo[]> = {}): boolean {
            return tryReadString(reader, "(") &&
                tryReadList() &&
                tryReadString(reader, ")");

            function tryReadList(): boolean {
                ///TODO: read the parameters
                outParameters.value = [];
                return true;
            }
        }
    }
}