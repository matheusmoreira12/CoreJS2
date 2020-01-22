import { URLToken } from "./index.js";
export declare class URLPath {
    static fromToken(token: URLToken): URLPath | null;
    constructor(...segments: string[]);
    toToken(): {
        type: string;
        items: any[];
    };
    collapse(): URLPath;
    segments: string[];
}
