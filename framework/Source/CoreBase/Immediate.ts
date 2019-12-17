export class Immediate {
    constructor(callback, thisArg = globalThis) {
        this.__callback = callback;
        this.__thisArg = thisArg;
        this.__timeoutHandle = null;
    }

    start() {
        this.abort();
        this.__timeoutHandle = setTimeout(this.__callback.bind(this.__thisArg));
    }

    abort() {
        if (this.__timeoutHandle === null)
            return false;
        clearTimeout(this.__timeoutHandle);
        return true;
    }

    __callback: Function;
    __thisArg: object;
    __timeoutHandle: number;
}