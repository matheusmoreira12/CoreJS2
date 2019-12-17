export var CoreBase;
(function (CoreBase) {
    CoreBase.STATUS = {
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
    let AjaxReadyState;
    (function (AjaxReadyState) {
        AjaxReadyState[AjaxReadyState["Unsent"] = 0] = "Unsent";
        AjaxReadyState[AjaxReadyState["Opened"] = 1] = "Opened";
        AjaxReadyState[AjaxReadyState["HeadersReceived"] = 2] = "HeadersReceived";
        AjaxReadyState[AjaxReadyState["Loading"] = 3] = "Loading";
        AjaxReadyState[AjaxReadyState["Done"] = 4] = "Done";
    })(AjaxReadyState = CoreBase.AjaxReadyState || (CoreBase.AjaxReadyState = {}));
    ;
    let AjaxMethod;
    (function (AjaxMethod) {
        AjaxMethod["Get"] = "GET";
        AjaxMethod["Head"] = "HEAD";
        AjaxMethod["Post"] = "POST";
        AjaxMethod["Put"] = "PUT";
        AjaxMethod["Delete"] = "DELETE";
        AjaxMethod["Connect"] = "CONNECT";
        AjaxMethod["Options"] = "OPTIONS";
        AjaxMethod["Trace"] = "TRACE";
        AjaxMethod["Patch"] = "PATCH";
    })(AjaxMethod = CoreBase.AjaxMethod || (CoreBase.AjaxMethod = {}));
    let AjaxResponseType;
    (function (AjaxResponseType) {
        AjaxResponseType["Default"] = "";
        AjaxResponseType["ArrayBuffer"] = "arraybuffer";
        AjaxResponseType["Blob"] = "blob";
        AjaxResponseType["Document"] = "document";
        AjaxResponseType["JSON"] = "json";
        AjaxResponseType["Text"] = "text";
    })(AjaxResponseType = CoreBase.AjaxResponseType || (CoreBase.AjaxResponseType = {}));
    class Ajax {
        constructor(method, url, events = {}, options = {}) {
            this.__method = method;
            this.__url = url;
            this.__events = events;
            this.__options = options;
            const { onabort, onerror, onload, onloadend, onloadstart, onprogress, onreadystatechange, ontimeout } = events;
            const { body, mimeType, responseType } = options;
            let request = new XMLHttpRequest();
            this.__xhr = request;
            if (onabort !== undefined)
                this.__onabort = onabort;
            if (onerror !== undefined)
                this.__onerror = onerror;
            if (onload !== undefined)
                this.__onload = onload;
            if (onloadend !== undefined)
                this.__onloadend = onloadend;
            if (onloadstart !== undefined)
                this.__onloadstart = onloadstart;
            if (onprogress !== undefined)
                this.__onprogress = onprogress;
            if (onreadystatechange !== undefined)
                this.__onreadystatechange = onreadystatechange;
            if (ontimeout !== undefined)
                this.__ontimeout = ontimeout;
            request.open(AjaxMethod[method], url);
            if (responseType !== undefined)
                request.responseType = responseType;
            if (mimeType !== undefined)
                request.overrideMimeType(mimeType);
            request.onabort = this.__request_onabort_handler.bind(this);
            request.onerror = this.__request_onerror_handler.bind(this);
            request.onload = this.__request_onload_handler.bind(this);
            request.onloadend = this.__request_onloadend_handler.bind(this);
            request.onloadstart = this.__request_onloadstart_handler.bind(this);
            request.onprogress = this.__request_onprogress_handler.bind(this);
            request.ontimeout = this.__request_ontimeout_handler.bind(this);
            request.onreadystatechange = this.__request_onreadystatechange_handler.bind(this);
            request.send(body);
        }
        static send(method, url, events, options) {
            return new Promise((resolve, reject) => {
                let ajax = new Ajax(AjaxMethod[method], url, events, options);
                ajax.__onload = (response) => {
                    resolve(response);
                };
                ajax.__onerror = (status, statusText) => {
                    reject(`Server responded with status ${status} (${statusText})`);
                };
            });
        }
        static get(url, events, options) {
            return this.send(AjaxMethod.Get, url, events, options);
        }
        static head(url, events, options) {
            return this.send(AjaxMethod.Head, url, events, options);
        }
        static post(url, events, options) {
            return this.send(AjaxMethod.Post, url, events, options);
        }
        static put(url, events, options) {
            return this.send(AjaxMethod.Put, url, events, options);
        }
        static delete(url, events, options) {
            return this.send(AjaxMethod.Delete, url, events, options);
        }
        static connect(url, events, options) {
            return this.send(AjaxMethod.Connect, url, events, options);
        }
        static options(url, events, options) {
            return this.send(AjaxMethod.Options, url, events, options);
        }
        static trace(url, events, options) {
            return this.send(AjaxMethod.Trace, url, events, options);
        }
        static patch(url, events, options) {
            return this.send(AjaxMethod.Patch, url, events, options);
        }
        __request_onabort_handler(evt) {
            if (this.__onabort)
                this.__onabort.call(this);
        }
        __request_onerror_handler(evt) {
            if (this.__onerror)
                this.__onerror.call(this, this.__xhr.status, this.__xhr.statusText);
        }
        __request_onload_handler(evt) {
            if (this.__onload)
                this.__onload.call(this, this.__xhr.response, this.__xhr.responseType);
        }
        __request_onloadend_handler(evt) {
            if (this.__onloadend)
                this.__onloadend.call(this);
        }
        __request_onloadstart_handler(evt) {
            if (this.__onloadstart)
                this.__onloadstart.call(this);
        }
        __request_onprogress_handler(evt) {
            if (this.__onprogress)
                this.__onprogress.call(this, evt.loaded, evt.total);
        }
        __request_ontimeout_handler(evt) {
            if (this.__ontimeout)
                this.__ontimeout.call(this);
        }
        __request_onreadystatechange_handler(evt) {
            if (this.__onreadystatechange)
                this.__onreadystatechange.call(this, this.__xhr.readyState);
        }
        get method() { return this.__method; }
        get url() { return this.__url; }
        get events() { return this.__events; }
        ;
        get options() { return this.__options; }
        ;
    }
    CoreBase.Ajax = Ajax;
    ;
})(CoreBase || (CoreBase = {}));
