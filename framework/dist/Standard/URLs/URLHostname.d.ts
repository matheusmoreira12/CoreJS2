import { URLToken } from "./index.js";
export declare class URLHostname {
    static fromToken(token: URLToken): URLHostname | null;
    constructor(...labels: string[]);
    toToken(): {
        type: string;
        items: any[];
    };
    labels: string[];
}
