import { KeyValuePair, Dictionary } from "../Standard/Collections";
export declare const StringUtils: {};
export declare class RegExpXContext {
    constructor(...namedPatterns: KeyValuePair<string, string>[]);
    derive(): RegExpXContext;
    declareNamedPattern(name: any, pattern: any): boolean;
    deleteNamedPattern(name: any): void;
    createRegExpX(pattern: any, flags?: string): RegExpX;
    readonly namedPattern: Dictionary<string, string>;
    private __namedPatterns;
}
export declare class RegExpX extends RegExp {
    constructor(pattern: any, flags?: string, context?: RegExpXContext);
    readonly context: RegExpXContext;
    private __context;
}
