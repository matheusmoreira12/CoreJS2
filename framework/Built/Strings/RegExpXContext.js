"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Collections_1 = require("../Standard/Collections");
const Exceptions_1 = require("../Standard/Exceptions");
const Types_1 = require("../Standard/Types/Types");
class RegExpXContext {
    constructor(...namedPatterns) {
        this.__namedPatterns = new Collections_1.Dictionary();
        this.__namedPatterns = new Collections_1.Dictionary(...namedPatterns);
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
exports.RegExpXContext = RegExpXContext;
function computeFinalPattern(pattern, context) {
    function replaceEscapedPattern(match) {
        const name = match.slice(1, match.length - 1); //Performatically extract name from escaped string
        let pattern = context.namedPatterns.get(name);
        if (pattern === undefined)
            throw new Exceptions_1.IndexOutOfRangeException(`No declared named pattern matches name "${name}".`);
        return pattern;
    }
    if (context === undefined)
        return pattern;
    pattern = pattern.replace(/(?<!\$)\$[A-Za-z]\w*?;/g, replaceEscapedPattern);
    pattern = pattern.replace(/\$\$/g, "$");
    return pattern;
}
class RegExpX extends RegExp {
    constructor(pattern, flags = "", context) {
        if (context !== undefined && !(context instanceof RegExpXContext))
            throw new Exceptions_1.ArgumentTypeException("context", Types_1.Type.of(context), Types_1.Type.get(RegExpXContext));
        const finalPattern = computeFinalPattern(pattern, context);
        super(finalPattern, flags);
        this.__context = context;
    }
    get context() { return this.__context; }
}
exports.RegExpX = RegExpX;
