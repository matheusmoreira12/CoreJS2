import { AjaxMethod, AjaxResponseType, IAjaxCallbacks, IAjaxOptions, AjaxEventArgs } from "./index.js";
import { Destructible } from "../../Standard/index.js";
import { assertParams } from "../../Validation/index.js";
import { FrameworkEvent, FrameworkEventArgs } from "../../Standard/Events/index.js";
import { AjaxRequestFailedException } from "./AjaxRequestFailedException.js";
import { AjaxProgressEventArgs } from "./AjaxProgressEventArgs.js";

const AJAX_METHOD_MAP = new Map([
    [AjaxMethod.Get, "GET"],
    [AjaxMethod.Head, "HEAD"],
    [AjaxMethod.Post, "POST"],
    [AjaxMethod.Put, "PUT"],
    [AjaxMethod.Delete, "DELETE"],
    [AjaxMethod.Connect, "CONNECT"],
    [AjaxMethod.Options, "OPTIONS"],
    [AjaxMethod.Trace, "TRACE"],
    [AjaxMethod.Patch, "PATCH"],
]);

const toNativeMethod = (method: number) => AJAX_METHOD_MAP.get(method)!;

const AJAX_RESPONSE_TYPE_MAP = new Map([
    [AjaxResponseType.Default, ""],
    [AjaxResponseType.ArrayBuffer, "arraybuffer"],
    [AjaxResponseType.Blob, "blob"],
    [AjaxResponseType.Document, "document"],
    [AjaxResponseType.JSON, "json"],
    [AjaxResponseType.Text, "text"],
]);

const toNativeResponseType = (responseType: number) => <XMLHttpRequestResponseType>AJAX_RESPONSE_TYPE_MAP.get(responseType)!;

const DEFAULT_MIME = "application/octet-stream";
const DEFAULT_RESPONSE_TYPE = AjaxResponseType.Default;

/**
 * A wrapper class for XMLHTTPRequest for making inline Ajax requests.
 */
export class Ajax extends Destructible {
    static send(method: number, url: string, callbacks: IAjaxCallbacks = {}, options: IAjaxOptions = {}): Promise<Response> {
        assertParams({ callbacks }, [IAjaxCallbacks]);
        assertParams({ options }, [IAjaxOptions]);

        //Create ajax wrapper
        const ajax = new Ajax(method, url, options);

        //Attach callbacks
        const { onAbort, onError, onLoad, onLoadEnd, onLoadStart, onProgress, onReadyStateChange, onTimeout } = callbacks;
        if (onAbort !== undefined)
            ajax.AbortEvent.attach(onAbort);
        if (onError !== undefined)
            ajax.ErrorEvent.attach(onError);
        if (onLoad !== undefined)
            ajax.LoadEvent.attach(onLoad);
        if (onLoadEnd !== undefined)
            ajax.LoadEndEvent.attach(onLoadEnd);
        if (onLoadStart !== undefined)
            ajax.LoadStartEvent.attach(onLoadStart);
        if (onProgress !== undefined)
            ajax.ProgressEvent.attach(onProgress);
        if (onReadyStateChange !== undefined)
            ajax.ReadyStateChangeEvent.attach(onReadyStateChange);
        if (onTimeout !== undefined)
            ajax.TimeoutEvent.attach(onTimeout);

        return ajax.loaded;
    }

    static get(url: string, events?: IAjaxCallbacks, options?: IAjaxOptions): Promise<Response> {
        return this.send(AjaxMethod.Get, url, events, options);
    }

    static head(url: string, events?: IAjaxCallbacks, options?: IAjaxOptions): Promise<Response> {
        return this.send(AjaxMethod.Head, url, events, options);
    }

    static post(url: string, events?: IAjaxCallbacks, options?: IAjaxOptions): Promise<Response> {
        return this.send(AjaxMethod.Post, url, events, options);
    }

    static put(url: string, events?: IAjaxCallbacks, options?: IAjaxOptions): Promise<Response> {
        return this.send(AjaxMethod.Put, url, events, options);
    }

    static delete(url: string, events?: IAjaxCallbacks, options?: IAjaxOptions): Promise<Response> {
        return this.send(AjaxMethod.Delete, url, events, options);
    }

    static connect(url: string, events?: IAjaxCallbacks, options?: IAjaxOptions): Promise<Response> {
        return this.send(AjaxMethod.Connect, url, events, options);
    }

    static options(url: string, events?: IAjaxCallbacks, options?: IAjaxOptions): Promise<Response> {
        return this.send(AjaxMethod.Options, url, events, options);
    }

    static trace(url: string, events?: IAjaxCallbacks, options?: IAjaxOptions): Promise<Response> {
        return this.send(AjaxMethod.Trace, url, events, options);
    }

    static patch(url: string, events?: IAjaxCallbacks, options?: IAjaxOptions): Promise<Response> {
        return this.send(AjaxMethod.Patch, url, events, options);
    }

    constructor(method: number, url: string, options: IAjaxOptions = {}) {
        super();

        assertParams({ method }, [Number]);
        assertParams({ url }, [String]);

        AjaxMethod.assertFlag(method);

        const xhr = new XMLHttpRequest();
        this.__xhr = xhr;
        xhr.open(toNativeMethod(method), url);

        const { responseType = DEFAULT_RESPONSE_TYPE, mimeType = DEFAULT_MIME, body = null } = options;
        if (responseType !== undefined)
            xhr.responseType = toNativeResponseType(responseType);
        if (mimeType !== undefined)
            xhr.overrideMimeType(mimeType);

        const loaded = new Promise<Response>((resolve, reject) => {
            xhr.addEventListener("load", () => {
                resolve(xhr.response);
            });
            xhr.addEventListener("error", () => {
                reject(new AjaxRequestFailedException(AjaxMethod.getLabel(method)!, url, xhr.status, xhr.statusText));
            });
        });
        this.__loaded = loaded;

        xhr.addEventListener("load", this.__request_onload_handler);
        xhr.addEventListener("loadend", this.__request_onloadend_handler);
        xhr.addEventListener("loadstart", this.__request_onloadstart_handler);
        xhr.addEventListener("abort", this.__request_onabort_handler);
        xhr.addEventListener("error", this.__request_onerror_handler);
        xhr.addEventListener("progress", this.__request_onprogress_handler);
        xhr.addEventListener("readystatechange", this.__request_onReadyStateChange_handler);
        xhr.addEventListener("timeout", this.__request_ontimeout_handler);

        xhr.send(body);

        this.__method = method;
        this.__url = url;
    }

    AbortEvent: FrameworkEvent<AjaxEventArgs> = new FrameworkEvent();
    ErrorEvent: FrameworkEvent<AjaxEventArgs> = new FrameworkEvent();
    LoadEvent: FrameworkEvent<AjaxEventArgs> = new FrameworkEvent();
    LoadEndEvent: FrameworkEvent<AjaxEventArgs> = new FrameworkEvent();
    LoadStartEvent: FrameworkEvent<AjaxEventArgs> = new FrameworkEvent();
    ProgressEvent: FrameworkEvent<AjaxProgressEventArgs> = new FrameworkEvent();
    ReadyStateChangeEvent: FrameworkEvent<AjaxEventArgs> = new FrameworkEvent();
    TimeoutEvent: FrameworkEvent<AjaxEventArgs> = new FrameworkEvent();

    __request_onabort_handler = (() => {
        this.AbortEvent.invoke(this, new AjaxEventArgs(this));
    }).bind(this);

    __request_onerror_handler = (() => {
        this.ErrorEvent.invoke(this, new AjaxEventArgs(this));
    }).bind(this);

    __request_onload_handler = (() => {
        this.LoadEvent.invoke(this, new AjaxEventArgs(this));
    }).bind(this);

    __request_onloadend_handler = (() => {
        this.LoadEndEvent.invoke(this, new AjaxEventArgs(this));
    }).bind(this);

    __request_onloadstart_handler = (() => {
        this.LoadStartEvent.invoke(this, new AjaxEventArgs(this));
    }).bind(this);

    __request_onprogress_handler = ((evt: ProgressEvent<XMLHttpRequestEventTarget>) => {
        this.ProgressEvent.invoke(this, new AjaxProgressEventArgs(this, evt.total, evt.loaded));
    }).bind(this);

    __request_ontimeout_handler = (() => {
        this.TimeoutEvent.invoke(this, new AjaxEventArgs(this));
    }).bind(this);

    __request_onReadyStateChange_handler = (() => {
        this.ReadyStateChangeEvent.invoke(this, new AjaxEventArgs(this));
    }).bind(this);

    private __xhr: XMLHttpRequest;

    get method(): number { return this.__method; }
    private __method: number;

    get url(): string { return this.__url; }
    private __url: string;

    get response(): Response { return this.__xhr.response; }

    get loaded(): Promise<Response> { return this.__loaded; }
    private __loaded: Promise<Response>;

    protected destructor() {
        if (this.__xhr.status == 0)
            this.__xhr.abort();

        this.__xhr.removeEventListener("load", this.__request_onload_handler);
        this.__xhr.removeEventListener("loadend", this.__request_onloadend_handler);
        this.__xhr.removeEventListener("loadstart", this.__request_onloadstart_handler);
        this.__xhr.removeEventListener("abort", this.__request_onabort_handler);
        this.__xhr.removeEventListener("error", this.__request_onerror_handler);
        this.__xhr.removeEventListener("progress", this.__request_onprogress_handler);
        this.__xhr.removeEventListener("readystatechange", this.__request_onReadyStateChange_handler);
        this.__xhr.addEventListener("timeout", this.__request_ontimeout_handler);

        if (!this.AbortEvent.isDestructed)
            this.AbortEvent.destruct();
        if (!this.ErrorEvent.isDestructed)
            this.ErrorEvent.destruct();
        if (!this.LoadEvent.isDestructed)
            this.LoadEvent.destruct();
        if (!this.LoadEndEvent.isDestructed)
            this.LoadEndEvent.destruct();
        if (!this.LoadStartEvent.isDestructed)
            this.LoadStartEvent.destruct();
        if (!this.ProgressEvent.isDestructed)
            this.ProgressEvent.destruct();
        if (!this.ReadyStateChangeEvent.isDestructed)
            this.ReadyStateChangeEvent.destruct();
        if (!this.TimeoutEvent.isDestructed)
            this.TimeoutEvent.destruct();
    }
};