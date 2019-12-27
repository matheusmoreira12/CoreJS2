export declare class Immediate {
    constructor(callback: any, thisArg?: typeof globalThis);
    start(): void;
    abort(): boolean;
    __callback: Function;
    __thisArg: object;
    __timeoutHandle: number;
}
