import { Shell } from "./Standard.Closures.js";
export declare class TokenReaderContext extends Shell {
    constructor();
    derive(): any;
    increment(): any;
    decrement(): any;
    jump(count: any): any;
    goto(index: any): any;
    readonly startIndex: any;
    currentIndex: any;
    readonly parentContext: any;
    readonly tokens: any;
    readonly isWithinBounds: any;
    readonly currentToken: any;
}
export declare class TokenReader extends TokenReaderContext {
    constructor(tokens: any, startIndex?: number);
}
