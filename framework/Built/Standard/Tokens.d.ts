export declare class TokenReaderContext<T> {
    constructor(tokens: T[], startIndex?: number);
    constructor(parentContext: TokenReaderContext<T>);
    derive(): TokenReaderContext<T>;
    increment(): number;
    decrement(): number;
    jump(count: any): any;
    goto(index: any): void;
    get isWithinBounds(): boolean;
    get currentToken(): any;
    get startIndex(): any;
    private __startIndex;
    get currentIndex(): any;
    set currentIndex(value: any);
    private __currentIndex;
    get parentContext(): any;
    private __parentContext;
    get tokens(): any;
    private __tokens;
}
export declare class TokenReader<T> extends TokenReaderContext<T> {
    constructor(tokens: T[], startIndex?: number);
}
