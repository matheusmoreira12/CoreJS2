import { ArgumentTypeException, FrameworkException } from "./Exceptions.js";
import { Type } from "./Types/Types.js";

export class TokenReaderContext<T> {
    constructor(tokens: T[], startIndex?: number);
    constructor(parentContext: TokenReaderContext<T>);
    constructor(arg0: T[] | TokenReaderContext<T>, arg1?: number) {
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
                        throw new ArgumentTypeException("startIndex", Type.of(arg1), Type.get(Number));
                }
            }
            else if (arg0 instanceof TokenReaderContext) {
                this.__parentContext = arg0;
                this.__currentIndex = this.__startIndex = this.__parentContext.currentIndex;
            }
            else
                throw new ArgumentTypeException("parentContext", Type.of(arg0), Type.get(Number));
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

    jump(count) {
        return this.__currentIndex += count;
    }

    goto(index) {
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

    get startIndex() { return this.__startIndex; }
    private __startIndex = null;

    get currentIndex() { return this.__currentIndex; }
    set currentIndex(value) { this.__currentIndex = value; }
    private __currentIndex = null;

    get parentContext() { return this.__parentContext; }
    private __parentContext = null;

    get tokens() { return this.__tokens; }
    private __tokens = null;
}

export class TokenReader<T> extends TokenReaderContext<T> {
    constructor(tokens: T[], startIndex?: number) {
        super(tokens, startIndex);
    }
}