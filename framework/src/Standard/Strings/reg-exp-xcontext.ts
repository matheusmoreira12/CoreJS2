import { IndexOutOfRangeException, ArgumentTypeException } from "../exceptions/index.js";
import { KeyValuePair, Dictionary } from "../collections/index.js";

export class RegExpXContext {
    constructor(...namedPatterns: KeyValuePair<string, string>[]) {
        this.__namedPatterns = new Dictionary(...namedPatterns);
    }

    derive() {
        return new RegExpXContext(...this.__namedPatterns);
    }

    declareNamedPattern(name: string, pattern: string) {
        if (this.__namedPatterns.has(name))
            return false;

        this.__namedPatterns.set(name, pattern);
        return true;
    }

    deleteNamedPattern(name: string) {
        return this.__namedPatterns.delete(name);
    }

    createRegExpX(pattern: string, flags?: string) {
        flags = flags === undefined ? "" : flags;

        let result = new RegExpX(pattern, flags, this);
        return result;
    }

    public get namedPatterns() { return this.__namedPatterns; }
    private __namedPatterns: Dictionary<string, string> = new Dictionary();
}

function computeFinalPattern(pattern: string, context: RegExpXContext | undefined) {
    function replaceEscapedPattern(match: string) {
        const name = match.slice(1, match.length - 1); //Performatically extract name from escaped string

        let pattern = (<RegExpXContext>context).namedPatterns.get(name);
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
    constructor(pattern: string, flags = "", context?: RegExpXContext) {
        if (context !== undefined && !(context instanceof RegExpXContext))
            throw new ArgumentTypeException("context", context, RegExpXContext);

        const finalPattern = computeFinalPattern(pattern, context);
        super(finalPattern, flags);

        this.__context = context;
    }

    get context(): RegExpXContext | undefined { return this.__context; }
    private __context: RegExpXContext | undefined;
}