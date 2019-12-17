export declare class Worker {
    static create(self: any, workerClass: any, ...args: any[]): void;
    static override(self: any, workerClass: any, ...args: any[]): void;
    static retrieve(self: any, workerClass: any): any;
    static delete(self: any, workerClass: any): void;
    constructor(self: any);
    initialize(): void;
    finalize(): void;
}
