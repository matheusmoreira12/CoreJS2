class TokenReaderContextClosure extends Closure {
    initializeWithTokens(tokens, startIndex) {
        this.tokens = tokens;
        this.currentIndex = this.startIndex = startIndex;
        this.initialized = true;
    }

    initializeWithParentContext(parentContext) {
        this.parentContext = parentContext;
        this.tokens = parentContext.tokens;
        this.startIndex = this.currentIndex = parentContext.currentIndex;
        this.initialized = true;
    }

    checkInitializedStatus() {
        if (!this.initialized)
            throw new InvalidOperationException("StringReader has not been properly initialized.");
    }

    derive() {
        let result = new TokenReaderContext();

        Closure.doIfExists(result, c => {
            c.initializeWithParentContext(this);
        }, this);

        return result;
    }

    increment() {
        this.checkInitializedStatus();

        return this.currentIndex++;
    }

    decrement() {
        this.checkInitializedStatus();

        return this.currentIndex--;
    }

    jump(count) {
        return this.do_increment(count);
    }

    goto(index) {
        this.checkInitializedStatus();

        this.currentIndex = index;
    }

    getIsWithinBounds() {
        this.checkInitializedStatus();

        return this.currentIndex >= 0 && this.currentIndex < this.tokens.length;
    }

    getCurrentToken() {
        if (this.getIsWithinBounds())
            return this.tokens[this.currentIndex];

        return null;
    }

    initialized = false;
    parentContext = null;
    tokens = null;
    startIndex = null;
    currentIndex = null;
}

export class TokenReaderContext extends Shell {
    constructor() {
        super(TokenReaderContextClosure);
    }

    derive() {
        return Closure.doIfExists(this, c => {
            return c.derive();
        });
    }

    increment() {
        return Closure.doIfExists(this, c => {
            return c.increment();
        });
    }

    decrement() {
        return Closure.doIfExists(this, c => {
            return c.decrement();
        });
    }

    jump(count) {
        return Closure.doIfExists(this, c => {
            return c.jump(count);
        });
    }

    goto(index) {
        return Closure.doIfExists(this, c => {
            return c.goto(index);
        });
    }

    get startIndex() {
        return Closure.doIfExists(this, c => {
            return c.startIndex;
        });
    }

    get currentIndex() {
        return Closure.doIfExists(this, c => {
            return c.currentIndex;
        });
    }

    set currentIndex(value) {
        Closure.doIfExists(this, c => {
            c.currentIndex = value;
        });
    }

    get parentContext() {
        return Closure.doIfExists(this, c => {
            return c.parentContext;
        });
    }

    get tokens() {
        return Closure.doIfExists(this, c => {
            return c.tokens;
        });
    }

    get isWithinBounds() {
        return Closure.doIfExists(this, c => {
            return c.getIsWithinBounds();
        });
    }

    get currentToken() {
        return Closure.doIfExists(this, c => {
            return c.getCurrentToken();
        });
    }
}

export class TokenReader extends TokenReaderContext {
    constructor(tokens, startIndex = 0) {
        super();

        Closure.doIfExists(this, c => {
            c.initializeWithTokens(tokens, startIndex);
        });
    }
}