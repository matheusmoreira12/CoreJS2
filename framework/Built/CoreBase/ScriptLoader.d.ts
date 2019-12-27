export declare class ScriptLoader {
    static get STATUS_FAILED(): number;
    static get STATUS_PENDING(): number;
    static get STATUS_LOADING(): number;
    static get STATUS_LOADED(): number;
    static load(url: any): Promise<void>;
    constructor(url: any);
    load(): Promise<HTMLScriptElement>;
    status: number;
    scriptTag: any;
}
