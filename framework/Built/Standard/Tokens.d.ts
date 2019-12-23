export declare class TokenReaderContext<T> {
    constructor(tokens: T[], startIndex?: number);
    constructor(parentContext: TokenReaderContext<T>);
    derive(): TokenReaderContext<T>;
    increment(): number;
    decrement(): number;
    jump(count: any): any;
    goto(index: any): void;
    readonly isWithinBounds: boolean;
    readonly currentToken: any;
    readonly startIndex: any;
    private __startIndex;
    currentIndex: any;
    private __currentIndex;
    readonly parentContext: any;
    private __parentContext;
    readonly tokens: any;
    private __tokens;
}
export declare class TokenReader<T> extends TokenReaderContext<T> {
    constructor(tokens: T[], startIndex?: number);
}
