import { ArgumentTypeException, FrameworkException } from "./exceptions/index.js"

export class TokenReaderContext<T> {
    constructor(tokens: T[], startIndex?: number);
    constructor(parentContext: TokenReaderContext<T>);
    constructor(arg0: T[] | TokenReaderContext<T>, arg1?: number) {
        this.__startIndex = 0;
        this.__tokens = [];
        this.__currentIndex = 0;

        if (arg0 === undefined)
            throw new FrameworkException(`No overload takes 0 argument.`);
        else {
            if (arg0 instanceof Array) {
                this.__tokens = arg0;

                if (arg1 === undefined)
                    this.__startIndex = 0;
                else {
                    if (typeof arg1 == "number")
                        this.__startIndex = arg1;
                    else
                        throw new ArgumentTypeException("startIndex", arg1, Number);
                }
            }
            else if (arg0 instanceof TokenReaderContext) {
                this.__parentContext = arg0;
                this.__currentIndex = this.__startIndex = this.__parentContext.currentIndex;
            }
            else
                throw new ArgumentTypeException("parentContext", arg0, Number);
        }
    }

    derive(): TokenReaderContext<T> {
        return new TokenReaderContext<T>(this);
    }

    increment() {
        return this.__currentIndex++;
    }

    decrement() {
        return this.__currentIndex--;
    }

    jump(count: number) {
        return this.__currentIndex += count;
    }

    goto(index: number) {
        this.currentIndex = index;
    }

    get isWithinBounds() {
        return this.currentIndex >= 0 && this.currentIndex < this.tokens.length;
    }

    get currentToken() {
        if (this.isWithinBounds)
            return this.tokens[this.currentIndex];

        return null;
    }

    get startIndex(): number { return this.__startIndex; }
    private __startIndex: number;

    get currentIndex(): number { return this.__currentIndex; }
    set currentIndex(value: number) { this.__currentIndex = value; }
    private __currentIndex: number;

    get parentContext(): TokenReaderContext<T> | null { return this.__parentContext; }
    private __parentContext: TokenReaderContext<T> | null = null;

    get tokens(): T[] { return this.__tokens; }
    private __tokens: T[];
}

export class TokenReader<T> extends TokenReaderContext<T> {
    constructor(tokens: T[], startIndex?: number) {
        super(tokens, startIndex);
    }
}