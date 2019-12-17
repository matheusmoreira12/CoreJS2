import { ObjectUtils } from "../Standard.ObjectUtils";

export namespace CoreBase {
    export const READY_STATE = {
        UNSENT: 0,
        OPENED: 1,
        HEADERS_RECEIVED: 2,
        LOADING: 3,
        DONE: 4
    };

    export const STATUS = {
        INFORMATIONAL: {
            CONTINUE: 100,
            SWITCHING_PROTOCOL: 101,
            PROCESSING: 102,
            EARLY_HINTS: 103
        },
        SUCCESSFUL: {
            OK: 200,
            CREATED: 201,
            ACCEPTED: 202,
            NON_AUTHORITATIVE_INFORMATION: 203,
            NO_CONTENT: 204,
            RESET_CONTENT: 205,
            PARTIAL_CONTENT: 206,
            MULTI_STATUS: 207,
            ALREADY_REPORTED: 208,
            IM_USED: 226
        },
        REDIRECTION: {
            MULTIPLE_CHOICE: 300,
            MOVED_PERMANENTLY: 301,
            FOUND: 302,
            SEE_OTHER: 303,
            NOT_MODIFIED: 304,
            USE_PROXY: 305,
            UNUSED: 306,
            TEMPORARY_REDIRECT: 307,
            PERMANENT_REDIRECT: 308
        },
        CLIENT_ERROR: {
            BAD_REQUEST: 400,
            UNAUTHORIZED: 401,
            PAYMENT_REQUIRED: 402,
            FORBIDDEN: 403,
            NOT_FOUND: 404,
            METHOD_NOT_ALLOWED: 405,
            NOT_ACCEPTABLE: 406,
            PROXY_AUTHENTICATION_REQUIRED: 407,
            REQUEST_TIMEOUT: 408,
            CONFLICT: 409,
            GONE: 410,
            LENGTH_REQUIRED: 411,
            PRECONDITION_FAILED: 412,
            PAYLOAD_TOO_LARGE: 413,
            URI_TOO_LONG: 414,
            UNSUPPORTED_MEDIA_TYPE: 415,
            REQUESTED_RANGE_NOT_SATISFIABLE: 416,
            EXPECTATION_FAILED: 417,
            IM_A_TEAPOT: 418,
            MISDIRECTED_REQUEST: 421,
            UNPROCESSABLE_ENTITY: 422,
            LOCKED: 423,
            FAILED_DEPENDENCY: 424,
            TOO_EARLY: 425,
            UPGRADE_REQUIRED: 426,
            PRECONDITION_REQUIRED: 428,
            TOO_MANY_REQUESTS: 429,
            REQUEST_HEADER_FIELDS_TOO_LARGE: 431,
            UNAVAILABLE_FOR_LEGAL_REASONS: 451,
        },
        SERVER_ERROR: {
            INTERNAL_SERVER_ERROR: 500,
            NOT_IMPLEMENTED: 501,
            BAD_GATEWAY: 502,
            SERVICE_UNAVAILABLE: 503,
            GATEWAY_TIMEOUT: 504,
            HTTP_VERSION_NOT_SUPPORTED: 505,
            VARIANT_ALSO_NEGOTIATES: 506,
            INSUFFICIENT_STORAGE: 507,
            LOOP_DETECTED: 508,
            NOT_EXTENDED: 510,
            NETWORK_AUTHENTICATION_REQUIRED: 511
        },
    };

    export enum AjaxMethod {
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

    export enum AjaxResponseType {
        Default = "",
        ArrayBuffer = "arraybuffer",
        Blob = "blob",
        Document = "document",
        JSON = "json",
        Text = "text"
    }

    export type AjaxOptions = {
        mimeType?: string,
        responseType?: AjaxResponseType,
        body?: Document | BodyInit,
    };

    export type AjaxEvents = {
        onabort?: EventHandlerNonNull,
        onerror?: EventHandlerNonNull,
        onload?: EventHandlerNonNull,
        onloadend?: EventHandlerNonNull,
        onloadstart?: EventHandlerNonNull,
        onprogress?: EventHandlerNonNull,
        onreadystatechange?: EventHandlerNonNull,
        ontimeout?: EventHandlerNonNull
    }

    export class Ajax extends XMLHttpRequest {
        static send(method: AjaxMethod, url, options = {}) {
            return new Promise((resolve, reject) => {
                let ajax = new Ajax(AjaxMethod[method], url, options);

                ajax.onload = function () {
                    resolve(ajax.response);
                }

                ajax.onerror = function () {
                    reject(`Server responded with status ${this.status} (${this.statusText})`);
                }
            });
        }

        static get(url: string, options: AjaxEvents = {}, events: AjaxEvents = {}) {
            return this.send(AjaxMethod.Get, url, options);
        }

        static head(url, options = {}) {
            return this.send(AjaxMethod.Head, url, options);
        }

        static post(url, options = {}) {
            return this.send(AjaxMethod.Post, url, options);
        }

        static put(url, options = {}) {
            return this.send(AjaxMethod.Put, url, options);
        }

        static delete(url, options = {}) {
            return this.send(AjaxMethod.Delete, url, options);
        }

        static connect(url, options = {}) {
            return this.send(AjaxMethod.Connect, url, options);
        }

        static options(url, options = {}) {
            return this.send(AjaxMethod.Options, url, options);
        }

        static trace(url, options = {}) {
            return this.send(AjaxMethod.Trace, url, options);
        }

        static patch(url, options = {}) {
            return this.send(AjaxMethod.Patch, url, options);
        }

        constructor(method: AjaxMethod, url: string, { onabort, onerror, onload, onloadend, onloadstart, onprogress, onreadystatechange, ontimeout }: AjaxEvents = {}, { mimeType, responseType, body }: AjaxOptions = {}) {
            super();

            this.url = url;

            if (onabort !== undefined)
                this.onabort = onabort;
            if (onerror !== undefined)
                this.onerror = onerror;
            if (onload !== undefined)
                this.onload = onload;
            if (onloadend !== undefined)
                this.onloadend = onloadend;
            if (onloadstart !== undefined)
                this.onloadstart = onloadstart;
            if (onprogress !== undefined)
                this.onprogress = onprogress;
            if (onreadystatechange !== undefined)
                this.onreadystatechange = onreadystatechange;
            if (ontimeout !== undefined)
                this.ontimeout = ontimeout;

            this.open(method, url);

            if (responseType !== undefined)
                this.responseType = responseType;
            if (mimeType !== undefined)
                this.overrideMimeType(mimeType);

            this.send(body);
        }

        url: string;
    };
}