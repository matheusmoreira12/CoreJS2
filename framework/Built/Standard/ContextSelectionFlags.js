import { ArgumentTypeException } from "./exceptions";
/**
 * ContextSelectionFlags Class
 * Allows the selection of individual flags.*/
export class ContextSelectionFlags {
    constructor(includeFlags = null, requireFlags = null, excludeFlags = null) {
        this.__includeFlags = includeFlags || [];
        this.__requireFlags = requireFlags || [];
        this.__excludeFlags = excludeFlags || [];
    }
    static [Symbol.species]() { return String; }
    static get all() { return new ContextSelectionFlags(["*"], null, null); }
    static get none() { return new ContextSelectionFlags(null, null, ["*"]); }
    static parse(str) {
        if (typeof str !== "string")
            throw new ArgumentTypeException(str, String);
        const MEMBER_PATTERN = "(\\w+(\\s+)?|\\*)+";
        const FORMAT_PATTERN = `^(?<include>${MEMBER_PATTERN})?(!(?<require>${MEMBER_PATTERN}))?(-(?<exclude>${MEMBER_PATTERN}))?$`;
        const SEPARATOR_REGEX = /\s*,\s*/;
        let FORMAT_REGEX = new RegExp(FORMAT_PATTERN);
        let matches = FORMAT_REGEX.exec(str);
        if (!matches)
            return null;
        let { include: includeFlagsStr, require: requireFlagsStr, exclude: excludeFlagsStr } = matches["groups"];
        let includeFlags = includeFlagsStr ? includeFlagsStr.split(SEPARATOR_REGEX) : [];
        let requireFlags = requireFlagsStr ? requireFlagsStr.split(SEPARATOR_REGEX) : [];
        let excludeFlags = excludeFlagsStr ? excludeFlagsStr.split(SEPARATOR_REGEX) : [];
        return new ContextSelectionFlags(includeFlags, requireFlags, excludeFlags);
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
    matchesFlag(flag) {
        const includeFlags = this.__includeFlags;
        const requireFlags = this.__requireFlags;
        const excludeFlags = this.__excludeFlags;
        function flagsInclude(flag, flags) {
            if (flags.includes("*"))
                return true;
            if (flags.includes(flag))
                return true;
            return false;
        }
        return !flagsInclude(flag, excludeFlags) && flagsInclude(flag, includeFlags);
    }
    matches(contextFlags) {
        return !this.__excludeFlags.some(f => contextFlags.matchesFlag(f)) &&
            this.__includeFlags.some(f => contextFlags.matchesFlag(f));
    }
}
