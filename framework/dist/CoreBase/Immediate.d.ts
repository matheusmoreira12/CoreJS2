export declare class Immediate {
    constructor(callback: Function, thisArg?: any);
    start(): void;
    abort(): boolean;
    __callback: Function;
    __thisArg: object;
    __timeoutHandle: number | null;
}
