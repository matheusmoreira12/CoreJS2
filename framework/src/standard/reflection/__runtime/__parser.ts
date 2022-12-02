import { StringReader } from "../../strings/index.js";
import { ConstructorInfo, MethodInfo, MethodInfoBase, ParameterInfo } from "../index.js";
import { OutputArgument } from "../types.js";

export module __Parser {
    export function tryParseConstructorParameters(bodyStr: string, declaringCtor: ConstructorInfo, outParameters: OutputArgument<ParameterInfo[]>): boolean {
        const r = new StringReader(bodyStr);
        return skipBlankSpace(r) &&
            tryReadString(r, "class") &&
            tryReadBlankSpace(r) &&
            tryReadIdentifier(r, {}) &&
            skipBlankSpace(r) &&
            skipExtends(r) &&
            skipBlankSpace(r) &&
            tryReadString(r, "{") &&
            tryFindAndReadCtorParameters();

        function skipExtends(r: StringReader) {
            tryReadString(r, "extends") && skipBlankSpace(r) && tryReadIdentifier(r, {});
            return true;
        }

        function tryFindAndReadCtorParameters() {
            while (!r.isEOF) {
                if (tryReadCtorParameters())
                    return true;
                r.skip();
            }
            return false;

            function tryReadCtorParameters() {
                const r1 = new StringReader(r);
                return tryReadString(r1, "constructor") &&
                    skipBlankSpace(r1) &&
                    tryReadParameters(r1, declaringCtor, outParameters);
            }
        }
    }

    export function tryParseMethodParameters(bodyStr: string, declaringMethod: MethodInfo, outParameters: OutputArgument<ParameterInfo[]>): boolean {
        const r = new StringReader(bodyStr);
        return tryParseAsyncArrow() ||
            tryParseArrow() ||
            tryParseAsyncGeneratorNamed() ||
            tryParseGeneratorNamed() ||
            tryParseAsyncNamed() ||
            tryParseNamed() ||
            tryParseAnonymous() ||
            tryParseGetter() ||
            tryParseSetter();

        function tryParseAsyncArrow(): boolean {
            const r1 = new StringReader(r);
            return tryReadString(r1, "async") &&
                skipBlankSpace(r1) &&
                tryReadArrow(r1);
        }

        function tryParseArrow(): boolean {
            const r1 = new StringReader(r);
            return tryReadArrow(r1);
        }

        function tryReadArrow(r: StringReader): boolean {
            return tryReadParameters(r, declaringMethod, outParameters) &&
                skipBlankSpace(r) &&
                tryReadString(r, "=>");
        }

        function tryParseAsyncGeneratorNamed(): boolean {
            const r1 = new StringReader(r);
            return tryReadString(r1, "async") &&
                tryReadBlankSpace(r1) &&
                tryReadGeneratorNamed(r1);
        }

        function tryParseGeneratorNamed(): boolean {
            const r1 = new StringReader(r);
            return tryReadGeneratorNamed(r1);
        }

        function tryReadGeneratorNamed(r: StringReader): boolean {
            return tryReadString(r, "function") &&
                skipBlankSpace(r) &&
                tryReadString(r, "*") &&
                skipBlankSpace(r) &&
                tryReadIdentifier(r, {}) &&
                skipBlankSpace(r) &&
                tryReadParameters(r, declaringMethod, outParameters) &&
                skipBlankSpace(r) &&
                tryReadString(r, "{");
        }

        function tryParseAsyncNamed(): boolean {
            const r1 = new StringReader(r);
            return tryReadString(r1, "async") &&
                tryReadBlankSpace(r1) &&
                tryReadNamed(r1);
        }

        function tryParseNamed(): boolean {
            const r1 = new StringReader(r);
            return tryReadNamed(r1);
        }

        function tryReadNamed(r: StringReader): boolean {
            return tryReadString(r, "function") &&
                tryReadBlankSpace(r) &&
                tryReadIdentifier(r, {}) &&
                skipBlankSpace(r) &&
                tryReadParameters(r, declaringMethod, outParameters) &&
                skipBlankSpace(r) &&
                tryReadString(r, "{");
        }

        function tryParseAnonymous(): boolean {
            const r1 = new StringReader(r);
            return tryReadString(r1, "function") &&
                skipBlankSpace(r1) &&
                tryReadParameters(r1, declaringMethod, outParameters) &&
                skipBlankSpace(r1) &&
                tryReadString(r1, "{");
        }

        function tryParseGetter(): boolean {
            const r1 = new StringReader(r);
            return tryReadString(r1, "get") &&
                tryReadBlankSpace(r1) &&
                tryReadIdentifier(r1, {}) &&
                skipBlankSpace(r1) &&
                tryReadParameters(r1, declaringMethod, outParameters) &&
                skipBlankSpace(r1) &&
                tryReadString(r1, "{");
        }

        function tryParseSetter(): boolean {
            const r1 = new StringReader(r);
            return tryReadString(r1, "set") &&
                tryReadBlankSpace(r1) &&
                tryReadIdentifier(r1, {}) &&
                skipBlankSpace(r1) &&
                tryReadParameters(r1, declaringMethod, outParameters) &&
                skipBlankSpace(r1) &&
                tryReadString(r1, "{");
        }
    }

    function tryReadParameters(r: StringReader, declaringMethod: MethodInfoBase, op: OutputArgument<ParameterInfo[]>): boolean {
        return tryReadString(r, "(") &&
            tryReadList() &&
            tryReadString(r, ")");

        function tryReadList(): boolean {
            ///TODO: actually read the parameters
            while (r.peek() != ")")
                r.skip();
            op.value = [];
            return true;
        }
    }

    function tryReadString(r: StringReader, str: string): boolean {
        const r1 = new StringReader(r);
        const l = str.length;
        const rcs = new Array(str.length);
        if (r1.readBlock(rcs, 0, l) == l && rcs.join("") == str) {
            r.seek(r1.position);
            return true;
        }
        return false;
    }

    function tryReadIdentifier(r: StringReader, oi: OutputArgument<string>): boolean {
        const sp = r.position;
        const r1 = new StringReader(r);
        while (/[a-zA-Z_\$]/.test(r1.peek() ?? ""))
            r1.skip();
        if (r1.position > sp) {
            const l = r1.position - sp;
            const id: string[] = new Array(l);
            r.readBlock(id, 0, l);
            oi.value = id.join("");
            return true;
        }
        return false;
    }

    function skipBlankSpace(r: StringReader) {
        tryReadBlankSpace(r);
        return true;
    }

    function tryReadBlankSpace(r: StringReader): boolean {
        const r1 = new StringReader(r);
        while (/\s/.test(r1.peek() ?? ""))
            r1.skip();
        const sp = r.position;
        if (r1.position > sp) {
            r.seek(r1.position);
            return true;
        }
        return false;
    }
}