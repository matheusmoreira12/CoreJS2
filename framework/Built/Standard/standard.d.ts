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
    static get [Symbol.species](): PromiseConstructor;
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
    get statusChangedEvent(): BroadcastFrameworkEvent;
    get startedEvent(): BroadcastFrameworkEvent;
    get finishedEvent(): BroadcastFrameworkEvent;
    get succeededEvent(): BroadcastFrameworkEvent;
    get failedEvent(): BroadcastFrameworkEvent;
    get status(): any;
    get error(): any;
    get loaded(): Promise<any>;
}
/**
 * IValueConverter Interface
 * Exposes a friendly interface for converting values between layers of abstraction.*/
export declare const IValueConverter: Interface;
export interface ValueConverter {
    convert: (value: any) => string;
    convertBack: (value: string) => any;
}
/**
 * ValueValidator Interface
 * Exposes a friendly interface for validating values between layers of abstraction.*/
export declare const IValueValidator: Interface;
