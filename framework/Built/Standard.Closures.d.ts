export declare class Closure {
    static getFor(shell: any): any;
    static doIfExists(shell: any, predicate: any, thisArg?: any): any;
    constructor(shell: any);
    initialize(...args: any[]): void;
}
export declare class Shell {
    constructor(closureClass: any, ...args: any[]);
}
