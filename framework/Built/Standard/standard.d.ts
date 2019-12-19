import { FrameworkException } from "./exceptions";
import { Enumeration } from "./Enumeration";
import { BroadcastFrameworkEvent } from "./Events";
import { Interface } from "./Types/Types";
export declare class ServerTaskException extends FrameworkException {
    constructor(message?: string, innerException?: any);
}
export declare class ServerErrorException extends ServerTaskException {
    constructor(serverMessage?: string, serverErrorCode?: number, message?: string, innerException?: string);
}
export declare class ServerTaskTimedOutException extends ServerTaskException {
    constructor(message?: string, innerException?: any);
}
export declare const ServerTaskStatus: Enumeration<import("./Enumeration").EnumerationValue>;
/**
 * ServerTask class
 * Extends the promise class, providing server-side error handling logic.*/
export declare class ServerTask {
    static readonly [Symbol.species]: PromiseConstructor;
    constructor(promise: any, options?: {
        timeout: number;
        maxRetries: number;
    });
    _execute(promise: any, resolve: any, reject: any): void;
    private __timedOutEvent;
    private __retriedEvent;
    private __statusChangedEvent;
    private __startedEvent;
    private __finishedEvent;
    private __succeededEvent;
    private __failedEvent;
    private __status;
    private __error;
    private __maxRetries;
    private __retries;
    private __timeout;
    private __loaded;
    readonly timedOutEvent: BroadcastFrameworkEvent;
    readonly retriedEvent: BroadcastFrameworkEvent;
    readonly statusChangedEvent: BroadcastFrameworkEvent;
    readonly startedEvent: BroadcastFrameworkEvent;
    readonly finishedEvent: BroadcastFrameworkEvent;
    readonly succeededEvent: BroadcastFrameworkEvent;
    readonly failedEvent: BroadcastFrameworkEvent;
    readonly status: any;
    readonly error: any;
    readonly loaded: Promise<any>;
    readonly maxRetries: number;
    readonly retries: number;
    readonly timeout: number;
}
/**
 * IValueConverter Interface
 * Exposes a friendly interface for converting values between layers of abstraction.*/
export declare const IValueConverter: Interface;
/**
 * ValueValidator Interface
 * Exposes a friendly interface for validating values between layers of abstraction.*/
export declare const IValueValidator: Interface;
