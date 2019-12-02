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
    }
}

export class Ajax {
    static get READYSTATE_DONE() { return 4; }

    async static get(url, options = {}) {
        let ajax = new Ajax(url, options);
        return ajax.done;
    }

    constructor(method, url, { body = null, onabort = null, onerror = null, onload = null, onloadend = null, onloadstart = null,
        onprogress = null, onreadystatechange = null, ontimeout = null }) {

        let xhr = new XMLHttpRequest();
        this.xhr = request;
        xhr.open(method, url);

        this.url = url;

        this.onabort = onabort;
        this.onerror = onerror;
        this.onload = onload;
        this.onloadend = onloadend;
        this.onloadstart = onloadstart;
        this.onprogress = onprogress;
        this.onreadystatechange = onreadystatechange;
        this.ontimeout = ontimeout;

        xhr.addEventListener("readystatechange", this.readystatechange_handler.bind(this));
        xhr.send(body);
    }

    readystatechange_handler(event) {
        switch (event.status) {

        }
    }

    get response() { return this.xhr.response; }

    get responseText() { return xhr.responseText; }

    get responseType() { return xhr.responseType; }
    set responseType(value) { xhr.responseType = value; }

    get responseURL() { return xhr.responseURL; }

    get responseXML() { return xhr.responseXML; }

    get status() { return xhr.status; }

    get readyState() { return xhr.readyState; }
};