export class Immediate {
    constructor(callback, thisArg = globalThis) {
        this.callback = callback;
        this.thisArg = thisArg;
        this.timeoutHandle = null;
    }
    start() {
        this.abort();
        this.timeoutHandle = setTimeout(this.callback.bind(this.thisArg));
    }
    abort() {
        if (this.timeoutHandle === null)
            return false;
        clearTimeout(this.timeoutHandle);
        return true;
    }
}
