export declare class URLTokenifier {
    tokenify(str: any): {
        type: string;
        items: ({
            type: string;
            value: any;
        } | {
            type: string;
            items: any[];
        })[];
    };
    detokenify(token: any): string;
}
export declare class URLHostname {
    static fromToken(token: any): URLHostname;
    constructor(labels: any);
    toToken(): {
        type: string;
        items: any[];
    };
}
export declare class URLData {
    static fromToken(token: any): URLData;
    static parse(value: any): URLData;
    constructor(hostname: any, path: any, protocol?: any, port?: any, query?: any, fragment?: any);
    toToken(): {
        type: string;
        items: any[];
    };
    toString(): string;
    collapse(): URLData;
}
export declare const URLUtils: {
    levelUp(url: any): string;
};
