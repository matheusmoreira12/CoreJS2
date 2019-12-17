import { Enumeration } from "./Enumeration";
import { BroadcastFrameworkEvent } from "./Events";
import { Interface } from "./Types/Types";
/**
 * ContextSelectionFlags Class
 * Allows the selection of individual flags.*/
export declare class ContextSelectionFlags {
    static [Symbol.species](): StringConstructor;
    static readonly all: ContextSelectionFlags;
    static readonly none: ContextSelectionFlags;
    static parse(str: any): ContextSelectionFlags;
    constructor(includeFlags?: any, requireFlags?: any, excludeFlags?: any);
    toString(): string;
    matchesFlag(flag: any): boolean;
    matches(contextFlags: any): boolean;
    __includeFlags: string[];
    __requireFlags: string[];
    __excludeFlags: string[];
}
export declare class ServerTaskError {
    constructor(message: string, errorCode: number);
    message: string;
    errorCode: number;
}
export declare const ServerTaskStatus: Enumeration;
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
