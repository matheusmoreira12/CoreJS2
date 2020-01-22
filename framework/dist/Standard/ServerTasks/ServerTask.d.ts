import { Enumeration } from "../Enumeration.js";
import { BroadcastFrameworkEvent } from "../Events/index.js";
export declare const ServerTaskStatus: Enumeration;
/**
 * ServerTask class
 * Extends the promise class, providing server-side error handling logic.*/
export declare class ServerTask<TResult> {
    static get [Symbol.species](): PromiseConstructor;
    constructor(promise: Promise<TResult>);
    _execute(promise: Promise<TResult>, resolve: (value: TResult | PromiseLike<TResult>) => void, reject: (reason: any) => void): void;
    private __statusChangedEvent;
    private __startedEvent;
    private __finishedEvent;
    private __succeededEvent;
    private __failedEvent;
    private __status;
    private __error;
    private __loaded;
    get statusChangedEvent(): BroadcastFrameworkEvent<object>;
    get startedEvent(): BroadcastFrameworkEvent<object>;
    get finishedEvent(): BroadcastFrameworkEvent<object>;
    get succeededEvent(): BroadcastFrameworkEvent<object>;
    get failedEvent(): BroadcastFrameworkEvent<object>;
    get status(): any;
    get error(): null;
    get loaded(): Promise<TResult>;
}
