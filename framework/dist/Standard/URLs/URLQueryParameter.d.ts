import { URLToken } from "./URLTokenifier";
export declare class URLQueryParameter {
    static fromToken(token: URLToken): URLQueryParameter | null;
    constructor(key: string, value: string);
    toToken(): URLToken;
    key: string;
    value: string;
}
