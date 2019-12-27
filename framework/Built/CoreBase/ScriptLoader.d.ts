export declare class ScriptLoader {
    static readonly STATUS_FAILED: number;
    static readonly STATUS_PENDING: number;
    static readonly STATUS_LOADING: number;
    static readonly STATUS_LOADED: number;
    static load(url: any): Promise<void>;
    constructor(url: any);
    load(): Promise<HTMLScriptElement>;
    status: number;
    scriptTag: any;
}
