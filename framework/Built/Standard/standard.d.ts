import { FrameworkException } from "./exceptions";
import { Enumeration } from "./Enumeration";
import { BroadcastFrameworkEvent } from "./Events";
import { Interface } from "./Interfaces/Interface";
export declare class ServerTaskException extends FrameworkException {
    constructor(serverMessage?: string, serverErrorCode?: number, message?: string, innerException?: string);
}
export declare const ServerTaskStatus: Enumeration<import("./Enumeration").EnumerationValue>;
/**
 * ServerTask class
 * Extends the promise class, providing server-side error handling logic.*/
export declare class ServerTask {
    static readonly [Symbol.species]: PromiseConstructor;
    constructor(promise: any);
    _execute(promise: any, resolve: any, reject: any): void;
    private __statusChangedEvent;
    private __startedEvent;
    private __finishedEvent;
    private __succeededEvent;
    private __failedEvent;
    private __status;
    private __error;
    private __loaded;
    readonly statusChangedEvent: BroadcastFrameworkEvent;
    readonly startedEvent: BroadcastFrameworkEvent;
    readonly finishedEvent: BroadcastFrameworkEvent;
    readonly succeededEvent: BroadcastFrameworkEvent;
    readonly failedEvent: BroadcastFrameworkEvent;
    readonly status: any;
    readonly error: any;
    readonly loaded: Promise<any>;
}
/**
 * IValueConverter Interface
 * Exposes a friendly interface for converting values between layers of abstraction.*/
export declare const IValueConverter: Interface;
/**
 * ValueValidator Interface
 * Exposes a friendly interface for validating values between layers of abstraction.*/
export declare const IValueValidator: Interface;
