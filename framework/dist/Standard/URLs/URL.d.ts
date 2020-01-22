import { URLQuery, URLHostname, URLToken, URLPath } from "./index.js";
export declare class URL {
    static fromToken(token: URLToken): URL | null;
    static parse(value: string): URL | null;
    constructor(hostname: URLHostname, path: URLPath, protocol?: string | null, port?: number | null, query?: URLQuery | null, fragment?: string | null);
    toToken(): URLToken;
    toString(): string | null;
    collapse(): URL;
    protocol: string | null;
    hostname: URLHostname;
    path: URLPath;
    port: number | null;
    query: URLQuery | null;
    fragment: string | null;
}
