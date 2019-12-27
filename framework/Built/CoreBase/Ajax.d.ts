export declare const STATUS: any;
export declare enum AjaxReadyState {
    Unsent = 0,
    Opened = 1,
    HeadersReceived = 2,
    Loading = 3,
    Done = 4
}
export declare enum AjaxMethod {
    Get = "GET",
    Head = "HEAD",
    Post = "POST",
    Put = "PUT",
    Delete = "DELETE",
    Connect = "CONNECT",
    Options = "OPTIONS",
    Trace = "TRACE",
    Patch = "PATCH"
}
export declare enum AjaxResponseType {
    Default = "",
    ArrayBuffer = "arraybuffer",
    Blob = "blob",
    Document = "document",
    JSON = "json",
    Text = "text"
}
export declare type AjaxOptions = {
    mimeType?: string;
    responseType?: AjaxResponseType;
    body?: Document | BodyInit;
};
export declare type AjaxCallbacks = {
    onabort?: AjaxAbortEventHandler;
    onerror?: AjaxErrorEventHandler;
    onload?: AjaxLoadEventHandler;
    onloadend?: AjaxLoadEndEventHandler;
    onloadstart?: AjaxLoadStartEventHandler;
    onprogress?: AjaxProgressEventHandler;
    onreadystatechange?: AjaxReadyStateChangeEventHandler;
    ontimeout?: AjaxTimeoutEventHandler;
};
export declare type AjaxAbortEventHandler = (this: Ajax) => void;
export declare type AjaxErrorEventHandler = (this: Ajax, status?: number, statusText?: string) => void;
export declare type AjaxLoadEventHandler = (this: Ajax, response?: any, responseType?: AjaxResponseType) => void;
export declare type AjaxLoadEndEventHandler = (this: Ajax) => void;
export declare type AjaxLoadStartEventHandler = (this: Ajax) => void;
export declare type AjaxProgressEventHandler = (this: Ajax, loaded?: number, total?: number) => void;
export declare type AjaxReadyStateChangeEventHandler = (this: Ajax, readyState?: AjaxReadyState) => void;
export declare type AjaxTimeoutEventHandler = (this: Ajax) => void;
export declare class Ajax {
    static send(method: AjaxMethod, url: string, events?: AjaxCallbacks, options?: AjaxOptions): Promise<unknown>;
    static get(url: string, events?: AjaxCallbacks, options?: AjaxOptions): Promise<unknown>;
    static head(url: string, events?: AjaxCallbacks, options?: AjaxOptions): Promise<unknown>;
    static post(url: string, events?: AjaxCallbacks, options?: AjaxOptions): Promise<unknown>;
    static put(url: string, events?: AjaxCallbacks, options?: AjaxOptions): Promise<unknown>;
    static delete(url: string, events?: AjaxCallbacks, options?: AjaxOptions): Promise<unknown>;
    static connect(url: string, events?: AjaxCallbacks, options?: AjaxOptions): Promise<unknown>;
    static options(url: string, events?: AjaxCallbacks, options?: AjaxOptions): Promise<unknown>;
    static trace(url: string, events?: AjaxCallbacks, options?: AjaxOptions): Promise<unknown>;
    static patch(url: string, events?: AjaxCallbacks, options?: AjaxOptions): Promise<unknown>;
    constructor(method: AjaxMethod, url: string, events?: AjaxCallbacks, options?: AjaxOptions);
    __request_onabort_handler(this: Ajax, evt: ProgressEvent): void;
    __request_onerror_handler(this: Ajax, evt: ProgressEvent): void;
    __request_onload_handler(this: Ajax, evt: ProgressEvent): void;
    __request_onloadend_handler(this: Ajax, evt: ProgressEvent): void;
    __request_onloadstart_handler(this: Ajax, evt: ProgressEvent): void;
    __request_onprogress_handler(this: Ajax, evt: ProgressEvent): void;
    __request_ontimeout_handler(this: Ajax, evt: ProgressEvent): void;
    __request_onreadystatechange_handler(this: Ajax, evt: ProgressEvent): void;
    private __onabort;
    private __onerror;
    private __onload;
    private __onloadend;
    private __onloadstart;
    private __onprogress;
    private __onreadystatechange;
    private __ontimeout;
    private __xhr;
    get method(): AjaxMethod;
    private __method;
    get url(): string;
    private __url;
    get events(): AjaxCallbacks;
    private __events;
    get options(): AjaxOptions;
    private __options;
}
