import { Dictionary } from "../Standard/Collections";
import { IndexOutOfRangeException, ArgumentTypeException } from "../Standard/Exceptions";
import { Type } from "../Standard/Types/Types";
export class RegExpXContext {
    constructor(...namedPatterns) {
        this.__namedPatterns = new Dictionary();
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
    get namedPattern() { return this.__namedPatterns; }
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
    constructor(pattern, flags = "", context) {
        if (context !== undefined && !(context instanceof RegExpXContext))
            throw new ArgumentTypeException("context", Type.of(context), Type.get(RegExpXContext));
        const finalPattern = computeFinalPattern(pattern, context);
        super(finalPattern, flags);
        this.__context = context;
    }
    get context() { return this.__context; }
}
