import { ArgumentTypeException, FrameworkException } from "./Exceptions";
import { Type } from "./Types/Types";
export class TokenReaderContext {
    constructor(arg0, arg1) {
        this.__startIndex = null;
        this.__currentIndex = null;
        this.__parentContext = null;
        this.__tokens = null;
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
    derive() {
        return new TokenReaderContext(this);
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
    get currentIndex() { return this.__currentIndex; }
    set currentIndex(value) { this.__currentIndex = value; }
    get parentContext() { return this.__parentContext; }
    get tokens() { return this.__tokens; }
}
export class TokenReader extends TokenReaderContext {
    constructor(tokens, startIndex) {
        super(tokens, startIndex);
    }
}
