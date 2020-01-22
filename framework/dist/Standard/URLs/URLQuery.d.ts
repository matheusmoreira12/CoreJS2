export declare class URLQuery {
    parameters: any[];
    static fromToken(token: any): any;
    constructor(parameters?: null);
    toToken(): {
        type: string;
        items: any[];
    };
}
