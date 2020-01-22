export declare class TokenReaderContext<T> {
    constructor(tokens: T[], startIndex?: number);
    constructor(parentContext: TokenReaderContext<T>);
    derive(): TokenReaderContext<T>;
    increment(): number;
    decrement(): number;
    jump(count: number): number;
    goto(index: number): void;
    get isWithinBounds(): boolean;
    get currentToken(): T | null;
    get startIndex(): number;
    private __startIndex;
    get currentIndex(): number;
    set currentIndex(value: number);
    private __currentIndex;
    get parentContext(): TokenReaderContext<T> | null;
    private __parentContext;
    get tokens(): T[];
    private __tokens;
}
export declare class TokenReader<T> extends TokenReaderContext<T> {
    constructor(tokens: T[], startIndex?: number);
}
