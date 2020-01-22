export declare type URLToken = {
    type: string;
    key?: string;
    value?: string;
    items?: URLToken[];
};
export declare class URLTokenifier {
    tokenify(str: string): URLToken;
    detokenify(token: URLToken): string | null;
}
