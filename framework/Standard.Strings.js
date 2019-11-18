import { Dictionary } from "./Standard.Collections";
import { ArgumentTypeException, IndexOutOfRangeException } from "./exceptions";
import { Type } from "./Standard.Types";

export const StringUtils = {

};

class RegExpXContext {
    declareNamedPattern(name, pattern) {
        if (namedPatterns.has(name))
            return false;

        namedPatterns.set(name, pattern);
        return true;
    }

    deleteNamedPattern(name) {
        return namedPatterns.delete(name);
    }
}

function computeFinalPattern(pattern, context) {
    function replaceEscapedPattern(match) {
        const name = match.slice(1, match.length - 1); //Performatically extract name from escaped string
        let pattern = context.namedPatterns.get(name);
        if (pattern === undefined)
            throw new IndexOutOfRangeException(`No declared named pattern matches name "${name}".`);
        return pattern;
    }

    if (context === null)
        return pattern;

    //Replace escaped named patterns
    pattern = pattern.replace(/\$[A-Za-z]\w*?;/g, replaceEscapedPattern);
    //Replace $$ with $
    pattern = pattern.replace(/\${2}/g, "$");

    return pattern;
}

export class RegExpX extends RegExp {
    static getNewContext() {
        let context = new RegExpXContext();

        let namedPatterns = new Dictionary();
        Object.defineProperty(context, {
            get namedPatterns() { return namedPatterns; }
        });

        return context;
    }

    constructor(pattern, flags = "", context = null) {
        if (context !== null && !(context instanceof RegExpXContext))
            throw new ArgumentTypeException("context", Type.of(context), Type.get(RegExpXContext));

        const finalPattern = computeFinalPattern(pattern, context);
        super(finalPattern, flags);

        this.context = context;
    }
}