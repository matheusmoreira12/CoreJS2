import { KeyValuePair, Dictionary } from "../Standard/Collections";
export declare class RegExpXContext {
    constructor(...namedPatterns: KeyValuePair<string, string>[]);
    derive(): RegExpXContext;
    declareNamedPattern(name: any, pattern: any): boolean;
    deleteNamedPattern(name: any): void;
    createRegExpX(pattern: any, flags?: string): RegExpX;
    get namedPattern(): Dictionary<string, string>;
    private __namedPatterns;
}
export declare class RegExpX extends RegExp {
    constructor(pattern: any, flags?: string, context?: RegExpXContext);
    get context(): RegExpXContext;
    private __context;
}
