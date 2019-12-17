import { Destructible } from "./Standard.Destructible.js";
import { Worker } from "./Standard.Workers.js";
declare class FrameworkEventWorker extends Worker {
    initialize(defaultListener: any, defaultListenerThisArg: any): void;
    finalize(): void;
    _includesListener(listener: any): any;
    attach(listener: any, thisArg: any): boolean;
    detach(listener: any): boolean;
    detachAll(): void;
    invoke(sender: any, args: any): void;
    do_attach(listener: any, thisArg?: any): boolean;
    do_detach(listener: any): boolean;
    do_invoke(sender: any, args: any): void;
    listeners: any;
}
/**
 * FrameworkEvent class
 * Enables event creation and manipulation, avoiding the use of callbacks.*/
export declare class FrameworkEvent extends Destructible {
    static attachMultiple(listener: any, ...events: any[]): void;
    static detachMultiple(listener: any, ...events: any[]): void;
    constructor(defaultListener?: any, defaultListenerThisArg?: any);
    destructor(): void;
}
export declare class NativeEventWorker extends FrameworkEventWorker {
    initialize(targetElement: any, nativeEventName: any, defaultListener: any, defaultListenerThisArg: any): void;
    nativeEvent_handler(evt: any): void;
    bound_nativeEvent_handler: any;
    finalize(): void;
}
/**
 * NativeEvent class
 * Routes DOM Events, enabling native event integration.
 */
export declare class NativeEvent extends FrameworkEvent {
    constructor(targetElement: any, nativeEventName: any, defaultListener?: any, defaultListenerThisArg?: any);
    readonly targetElement: any;
}
/**
 * BroadcastFrameworkEvent Class
 * Enables the broadcasting of framework events.*/
export declare class BroadcastFrameworkEvent extends FrameworkEvent {
    constructor(name: any, defaultListener?: any, defaultListenerThisArg?: any);
}
/**
 * FrameworkCustomEvent class
 * Simplifies DOM custom event creation and manipulation.*/
export declare class FrameworkCustomEvent {
    constructor(target: any, type: any);
    _listenerMap: WeakMap<object, any>;
    invoke(args?: {}): void;
    attach(listener: any): void;
    detach(listener: any): void;
}
export {};
