import { Shell, Closure } from "./Standard.Closures.js";
import { InvalidOperationException } from "./exceptions.js";

class StringReaderContextClosure extends Closure {
    initializeWithContent(content, startIndex) {
        this.content = content;
        this.startIndex = startIndex;
        this.initialized = true;
    }

    initializeWithParentContext(parentContext) {
        this.parentContext = parentContext;
        this.content = parentContext.content;
        this.startIndex = this.currentIndex = parentContext.currentIndex;
        this.initialized = true;
    }

    checkInitializedStatus() {
        if (!this.initialized)
            throw new InvalidOperationException("StringReader has not been properly initialized.");
    }

    getParentContext() {
        return this.parentContext;
    }

    getContent() {
        return this.parentContext;
    }

    getStartIndex() {
        return this.startIndex;
    }

    getCurrentIndex() {
        return this.currentIndex;
    }

    setCurrentIndex(value) {
        this.currentIndex = value;
    }

    doIncrement() {
        this.currentIndex++;
    }

    doDecrement() {
        this.currentIndex--;
    }

    doJump(count) {
        this.currentIndex += count;
    }

    doGoto(index) {
        this.currentIndex = index;
    }

    initialized = false;
    parentContext = null;
    content = null;
    startIndex = null;
}

export class StringReaderContext extends Shell {
    constructor() {
        super(StringReaderClosure);
    }
}

export class StringReader extends StringReaderContext {
}