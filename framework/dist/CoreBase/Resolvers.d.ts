export declare class AsynchronousResolver {
    resolved: Promise<unknown>;
    resolve: (value: any) => void;
    reject: (error: any) => void;
    static get STATUS_REJECTED(): number;
    static get STATUS_PENDING(): number;
    static get STATUS_RESOLVED(): number;
    constructor();
    status: number;
}
