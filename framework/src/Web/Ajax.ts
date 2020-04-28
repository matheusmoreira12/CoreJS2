import { AjaxMethod } from "./AjaxMethod.js";
import { IAjaxOptions } from "./IAjaxOptions.js";
import { IAjaxCallbacks } from "./IAjaxCallbacks.js";
import { assertParams } from "../Validation/index.js";
import { FrameworkEvent, FrameworkEventArgs } from "../Standard/Events/index.js";
import { Destructible } from "../Standard/index.js";
import { AjaxEventArgs } from "./AjaxEventArgs.js";

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

export enum AjaxResponseType { Other, Default, ArrayBuffer, Blob, Document, JSON, Text }

const AJAX_RESPONSE_TYPE_MAP = new Map([
    [AjaxResponseType.Default, ""],
    [AjaxResponseType.ArrayBuffer, "arraybuffer"],
    [AjaxResponseType.Blob, "blob"],
    [AjaxResponseType.Document, "document"],
    [AjaxResponseType.JSON, "json"],
    [AjaxResponseType.Text, "text"],
]);

/**
 * A wrapper class for XMLHTTPRequest for making inline Ajax requests.
 */
export class Ajax extends Destructible {
    static send(method: number, url: string, callbacks: IAjaxCallbacks = {}, options: IAjaxOptions = {}): Promise<Response> {
        assertParams({ callbacks }, [IAjaxCallbacks]);
        assertParams({ options }, [IAjaxOptions]);

        //Create ajax wrapper
        const ajax = new Ajax(method, url);

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

        //Set options
        const { responseType, mimeType, body } = options;
        if (responseType !== undefined)
            ajax.responseType = responseType;
        if (mimeType !== undefined)
            ajax.mimeType = mimeType;
        if (body !== undefined)
            ajax.body = body;

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

    constructor(method: number, url: string) {
        super();

        assertParams({ method }, [Number]);
        assertParams({ url }, [String]);

        AjaxMethod.assertFlag(method);

        this.__method = method;
        this.__url = url;

        let xhr = new XMLHttpRequest();
        this.__xhr = xhr;

        let ajaxMethodStr = AJAX_METHOD_MAP.get(method)!;
        xhr.open(ajaxMethodStr, url);

        if (mimeType !== undefined)
            xhr.overrideMimeType(mimeType);
        xhr.send(body);
    }

    AbortEvent: FrameworkEvent<AjaxEventArgs> = new FrameworkEvent();
    ErrorEvent: FrameworkEvent<AjaxEventArgs> = new FrameworkEvent();
    LoadEvent: FrameworkEvent<AjaxEventArgs> = new FrameworkEvent();
    LoadEndEvent: FrameworkEvent<AjaxEventArgs> = new FrameworkEvent();
    LoadStartEvent: FrameworkEvent<AjaxEventArgs> = new FrameworkEvent();
    ProgressEvent: FrameworkEvent<AjaxEventArgs> = new FrameworkEvent();
    ReadyStateChangeEvent: FrameworkEvent<AjaxEventArgs> = new FrameworkEvent();
    TimeoutEvent: FrameworkEvent<AjaxEventArgs> = new FrameworkEvent();

    __request_onAbort_handler(this: Ajax) {
        this.AbortEvent.invoke(this, new FrameworkEventArgs());
    }
    __request_onError_handler(this: Ajax) {
        this.ErrorEvent.invoke(this, args);
    }
    __request_onLoad_handler(this: Ajax) {
        this.LoadEvent.invoke(this, args);
    }
    __request_onLoadEnd_handler(this: Ajax) {
        this.LoadEndEvent.invoke(this, args);
    }
    __request_onLoadStart_handler(this: Ajax) {
        this.LoadStartEvent.invoke(this, args);
    }
    __request_onProgress_handler(this: Ajax, evt: ProgressEvent) {
        this.ProgressEvent.invoke(this, args);
    }
    __request_ontimeout_handler(this: Ajax) {
        this.TimeoutEvent.invoke(this, args);
    }
    __request_onReadyStateChange_handler(this: Ajax) {
        this.ReadyStateChangeEvent.invoke(this, args);
    }

    private __xhr: XMLHttpRequest;

    get method(): number { return this.__method; }
    private __method: number;

    get url(): string { return this.__url; }
    private __url: string;

    get loaded(): Promise<Response> { return this.__loaded; }
    private __loaded: Promise<Response>;

    set responseType(value: AjaxResponseType) {
        const responseTypeNative = <XMLHttpRequestResponseType>(AJAX_RESPONSE_TYPE_MAP.get(value));
        this.__xhr.responseType = responseTypeNative;
        this.__responseType = value;
    }
    get responseType(): AjaxResponseType { return this.__responseType; }
    private __responseType: AjaxResponseType = AjaxResponseType.Default;

    protected destructor() {
        if (this.__xhr.status == 0)
            this.__xhr.abort();

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