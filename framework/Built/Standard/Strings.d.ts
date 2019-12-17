export declare const StringUtils: {};
export declare class RegExpXContext {
    constructor();
    derive(): RegExpXContext;
    declareNamedPattern(name: any, pattern: any): boolean;
    deleteNamedPattern(name: any): any;
    createRegExpX(pattern: any, flags?: string): RegExpX;
}
export declare class RegExpX extends RegExp {
    constructor(pattern: any, flags?: string, context?: any);
}
