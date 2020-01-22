import { KeyValuePair, Dictionary } from "../Collections/index.js";
export declare class RegExpXContext {
    constructor(...namedPatterns: KeyValuePair<string, string>[]);
    derive(): RegExpXContext;
    declareNamedPattern(name: string, pattern: string): boolean;
    deleteNamedPattern(name: string): void;
    createRegExpX(pattern: string, flags?: string): RegExpX;
    get namedPatterns(): Dictionary<string, string>;
    private __namedPatterns;
}
export declare class RegExpX extends RegExp {
    constructor(pattern: string, flags?: string, context?: RegExpXContext);
    get context(): RegExpXContext | undefined;
    private __context;
}
