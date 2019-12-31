import { IndexOutOfRangeException, ArgumentTypeException } from "../Standard/Exceptions.js";
import { Type } from "../Standard/Types/Types.js";
import { KeyValuePair } from "../Standard/Collections/KeyValuePair.js";
import { Dictionary } from "../Standard/Collections/Dictionary.js";

export class RegExpXContext {
    constructor(...namedPatterns: KeyValuePair<string, string>[]) {
        this.__namedPatterns = new Dictionary(...namedPatterns);
    }

    derive() {
        return new RegExpXContext(...this.__namedPatterns);
    }

    declareNamedPattern(name, pattern) {
        if (this.__namedPatterns.has(name))
            return false;

        this.__namedPatterns.set(name, pattern);
        return true;
    }

    deleteNamedPattern(name) {
        return this.__namedPatterns.delete(name);
    }

    createRegExpX(pattern, flags = "") {
        let result = new RegExpX(pattern, flags, this);
        return result;
    }

    public get namedPattern() { return this.__namedPatterns; }
    private __namedPatterns: Dictionary<string, string> = new Dictionary();
}

function computeFinalPattern(pattern, context) {
    function replaceEscapedPattern(match) {
        const name = match.slice(1, match.length - 1); //Performatically extract name from escaped string
        let pattern = context.namedPatterns.get(name);
        if (pattern === undefined)
            throw new IndexOutOfRangeException(`No declared named pattern matches name "${name}".`);
        return pattern;
    }

    if (context === undefined)
        return pattern;

    pattern = pattern.replace(/(?<!\$)\$[A-Za-z]\w*?;/g, replaceEscapedPattern);

    pattern = pattern.replace(/\$\$/g, "$");
    return pattern;
}

export class RegExpX extends RegExp {
    constructor(pattern, flags = "", context?: RegExpXContext) {
        if (context !== undefined && !(context instanceof RegExpXContext))
            throw new ArgumentTypeException("context", Type.of(context), Type.get(RegExpXContext));

        const finalPattern = computeFinalPattern(pattern, context);
        super(finalPattern, flags);

        this.__context = context;
    }

    get context(): RegExpXContext { return this.__context; }
    private __context: RegExpXContext;
}