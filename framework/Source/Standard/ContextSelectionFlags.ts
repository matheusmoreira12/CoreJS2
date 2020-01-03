import { ArgumentTypeException } from "./Exceptions.js";
import { RegExpXContext, RegExpX } from "../Strings/RegExpXContext.js";

const REGEXPX_CONTEXT = new RegExpXContext();
REGEXPX_CONTEXT.declareNamedPattern("member", "(\\w+(\\s+)?|\\*)+");

const FORMAT_REGEXPX = new RegExpX("^(?<include>$member;)?(!(?<require>$member;))?(-(?<exclude>$member;))?$", "", REGEXPX_CONTEXT);

const SEPARATOR_REGEX = /\s*,\s*/;

/**
 * ContextSelectionFlags Class
 * Allows the selection of individual flags.*/
export class ContextSelectionFlags {
    static [Symbol.species]() { return String; }

    static get all() { return new ContextSelectionFlags(["*"], [], []); }

    static get none() { return new ContextSelectionFlags([], [], ["*"]); }

    static parse(value: string) {
        if (typeof value !== "string")
            throw new ArgumentTypeException(value, String);

        let matches = FORMAT_REGEXPX.exec(value);
        if (!matches)
            return null;

        let { include: includeFlagsStr, require: requireFlagsStr, exclude: excludeFlagsStr } = matches.groups;
        let includeFlags = includeFlagsStr ? includeFlagsStr.split(SEPARATOR_REGEX) : [];
        let requireFlags = requireFlagsStr ? requireFlagsStr.split(SEPARATOR_REGEX) : [];
        let excludeFlags = excludeFlagsStr ? excludeFlagsStr.split(SEPARATOR_REGEX) : [];
        return new ContextSelectionFlags(includeFlags, requireFlags, excludeFlags);
    }

    constructor(includeFlags?: string[], requireFlags?: string[], excludeFlags?: string[]) {
        this.__includeFlags = includeFlags === undefined ? [] : includeFlags;
        this.__requireFlags = requireFlags === undefined ? [] : requireFlags;
        this.__excludeFlags = excludeFlags === undefined ? [] : excludeFlags;
    }

    toString() {
        let str = "";
        str += this.__includeFlags.join(", ");
        if (this.__requireFlags.length > 0)
            str += " !" + this.__requireFlags.join(", ");
        if (this.__excludeFlags.length > 0)
            str += " -" + this.__excludeFlags.join(", ");
        return str;
    }

    matchesFlag(flag: string): boolean {
        const includeFlags = this.__includeFlags;
        const requireFlags = this.__requireFlags;
        const excludeFlags = this.__excludeFlags;

        function flagsInclude(flag: string, flags: string[]) {
            if (flags.includes("*"))
                return true;
            if (flags.includes(flag))
                return true;
            return false;
        }

        return !flagsInclude(flag, excludeFlags) && flagsInclude(flag, includeFlags);
    }

    matches(contextFlags: ContextSelectionFlags) {
        return !this.__excludeFlags.some(f => contextFlags.matchesFlag(f)) &&
            this.__includeFlags.some(f => contextFlags.matchesFlag(f));
    }
    __includeFlags: string[];
    __requireFlags: string[];
    __excludeFlags: string[];
}
