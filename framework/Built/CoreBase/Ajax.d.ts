export declare namespace CoreBase {
    const STATUS: {
        INFORMATIONAL: {
            CONTINUE: number;
            SWITCHING_PROTOCOL: number;
            PROCESSING: number;
            EARLY_HINTS: number;
        };
        SUCCESSFUL: {
            OK: number;
            CREATED: number;
            ACCEPTED: number;
            NON_AUTHORITATIVE_INFORMATION: number;
            NO_CONTENT: number;
            RESET_CONTENT: number;
            PARTIAL_CONTENT: number;
            MULTI_STATUS: number;
            ALREADY_REPORTED: number;
            IM_USED: number;
        };
        REDIRECTION: {
            MULTIPLE_CHOICE: number;
            MOVED_PERMANENTLY: number;
            FOUND: number;
            SEE_OTHER: number;
            NOT_MODIFIED: number;
            USE_PROXY: number;
            UNUSED: number;
            TEMPORARY_REDIRECT: number;
            PERMANENT_REDIRECT: number;
        };
        CLIENT_ERROR: {
            BAD_REQUEST: number;
            UNAUTHORIZED: number;
            PAYMENT_REQUIRED: number;
            FORBIDDEN: number;
            NOT_FOUND: number;
            METHOD_NOT_ALLOWED: number;
            NOT_ACCEPTABLE: number;
            PROXY_AUTHENTICATION_REQUIRED: number;
            REQUEST_TIMEOUT: number;
            CONFLICT: number;
            GONE: number;
            LENGTH_REQUIRED: number;
            PRECONDITION_FAILED: number;
            PAYLOAD_TOO_LARGE: number;
            URI_TOO_LONG: number;
            UNSUPPORTED_MEDIA_TYPE: number;
            REQUESTED_RANGE_NOT_SATISFIABLE: number;
            EXPECTATION_FAILED: number;
            IM_A_TEAPOT: number;
            MISDIRECTED_REQUEST: number;
            UNPROCESSABLE_ENTITY: number;
            LOCKED: number;
            FAILED_DEPENDENCY: number;
            TOO_EARLY: number;
            UPGRADE_REQUIRED: number;
            PRECONDITION_REQUIRED: number;
            TOO_MANY_REQUESTS: number;
            REQUEST_HEADER_FIELDS_TOO_LARGE: number;
            UNAVAILABLE_FOR_LEGAL_REASONS: number;
        };
        SERVER_ERROR: {
            INTERNAL_SERVER_ERROR: number;
            NOT_IMPLEMENTED: number;
            BAD_GATEWAY: number;
            SERVICE_UNAVAILABLE: number;
            GATEWAY_TIMEOUT: number;
            HTTP_VERSION_NOT_SUPPORTED: number;
            VARIANT_ALSO_NEGOTIATES: number;
            INSUFFICIENT_STORAGE: number;
            LOOP_DETECTED: number;
            NOT_EXTENDED: number;
            NETWORK_AUTHENTICATION_REQUIRED: number;
        };
    };
    enum AjaxReadyState {
        Unsent = 0,
        Opened = 1,
        HeadersReceived = 2,
        Loading = 3,
        Done = 4
    }
    enum AjaxMethod {
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
    enum AjaxResponseType {
        Default = "",
        ArrayBuffer = "arraybuffer",
        Blob = "blob",
        Document = "document",
        JSON = "json",
        Text = "text"
    }
    type AjaxOptions = {
        mimeType?: string;
        responseType?: AjaxResponseType;
        body?: Document | BodyInit;
    };
    type AjaxCallbacks = {
        onabort?: AjaxAbortEventHandler;
        onerror?: AjaxErrorEventHandler;
        onload?: AjaxLoadEventHandler;
        onloadend?: AjaxLoadEndEventHandler;
        onloadstart?: AjaxLoadStartEventHandler;
        onprogress?: AjaxProgressEventHandler;
        onreadystatechange?: AjaxReadyStateChangeEventHandler;
        ontimeout?: AjaxTimeoutEventHandler;
    };
    type AjaxAbortEventHandler = (this: Ajax) => void;
    type AjaxErrorEventHandler = (this: Ajax, status?: number, statusText?: string) => void;
    type AjaxLoadEventHandler = (this: Ajax, response?: any, responseType?: AjaxResponseType) => void;
    type AjaxLoadEndEventHandler = (this: Ajax) => void;
    type AjaxLoadStartEventHandler = (this: Ajax) => void;
    type AjaxProgressEventHandler = (this: Ajax, loaded?: number, total?: number) => void;
    type AjaxReadyStateChangeEventHandler = (this: Ajax, readyState?: AjaxReadyState) => void;
    type AjaxTimeoutEventHandler = (this: Ajax) => void;
    class Ajax {
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
        readonly method: AjaxMethod;
        private __method;
        readonly url: string;
        private __url;
        readonly events: AjaxCallbacks;
        private __events;
        readonly options: AjaxOptions;
        private __options;
    }
}
