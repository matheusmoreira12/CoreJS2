/**
 * ReverseIterator class
 * Iterates backwards through an Iterable.
 */
export declare class ReverseIterator {
    constructor(iterable: any);
    [Symbol.iterator]: () => this;
    next(): {
        done: boolean;
        value: any;
    };
}
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
    matches(contextFlags: any): any;
}
export declare class ServerTaskError {
    constructor(message: any, errorCode: any);
    [Symbol.toString](): any;
}
export declare const ServerTaskStatus: any;
/**
 * ServerTask class
 * Extends the promise class, providing server-side error handling logic.*/
export declare class ServerTask extends Promise {
    static readonly [Symbol.species]: PromiseConstructor;
    constructor(promise: any, options: any);
    _execute(promise: any, resolve: any, reject: any): void;
    _timedOutEvent: any;
    _retriedEvent: any;
    _statusChangedEvent: any;
    _startedEvent: any;
    _finishedEvent: any;
    _succeededEvent: any;
    _failedEvent: any;
    _status: any;
    _error: any;
    readonly timedOutEvent: any;
    readonly retriedEvent: any;
    readonly statusChangedEvent: any;
    readonly startedEvent: any;
    readonly finishedEvent: any;
    readonly succeededEvent: any;
    readonly failedEvent: any;
    readonly status: any;
    readonly error: any;
    readonly maxRetries: any;
    readonly retries: any;
    readonly timeout: any;
}
export declare const IValueConverter: any;
/**
 * ValueConverter Class
 * Exposes a friendly interface for converting values between layers of abstraction.*/
export declare class ValueConverter {
    convert(value: any): void;
    convertBack(value: any): void;
}
/**
 * ValueValidator Class
 * Exposes a friendly interface for validating values between layers of abstraction.*/
export declare class ValueValidator {
    validate(value: any): void;
}
