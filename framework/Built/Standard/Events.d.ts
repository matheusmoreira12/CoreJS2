import { Dictionary } from "./Collections";
import { Destructible } from "./Destructible";
declare type EventListenerData = {
    thisArg: any;
};
/**
 * FrameworkEvent class
 * Enables event creation and manipulation, avoiding the use of callbacks.*/
export declare class FrameworkEvent extends Destructible {
    static attachMultiple(listener: any, ...events: any[]): void;
    static detachMultiple(listener: any, ...events: any[]): void;
    constructor(defaultListener?: Function, defaultListenerThisArg?: any);
    __detachAll(): void;
    attach(listener: any, thisArg?: any): boolean;
    detach(listener: any): boolean;
    protected __invokeListeners(sender: any, args: any): void;
    invoke(sender: any, args: any): void;
    __listeners: Dictionary<Function, EventListenerData>;
    destructor(): void;
}
/**
 * NativeEvent class
 * Routes DOM Events, enabling native event integration.
 */
export declare class NativeEvent extends FrameworkEvent {
    constructor(target: EventTarget, nativeEventName: string, defaultListener?: any, defaultListenerThisArg?: any);
    private __target_nativeEvent_handler;
    readonly target: EventTarget;
    private __target;
    readonly nativeEventName: string;
    private __nativeEventName;
    readonly defaultListener: any;
    private __defaultListener;
    destructor(): void;
}
/**
 * BroadcastFrameworkEvent Class
 * Enables the broadcasting of framework events.*/
export declare class BroadcastFrameworkEvent extends FrameworkEvent {
    private static __EventBroadcastEvent;
    constructor(name: string, defaultListener?: any, defaultListenerThisArg?: any);
    __onEventBroadcast: (sender: any, args: any) => void;
    __onRoutedEvent: (sender: any, args: any) => void;
    broadcast(sender: any, args: object): void;
    route(baseEvent: FrameworkEvent): boolean;
    unroute(baseEvent: any): boolean;
    unrouteAll(): void;
    private __routedEvents;
    readonly name: string;
    private __name;
    destrutor(): void;
}
/**
 * FrameworkCustomEvent class
 * Simplifies DOM custom event creation and manipulation.*/
export declare class FrameworkCustomEvent extends FrameworkEvent {
    constructor(target: EventTarget, eventName: string, defaultListener?: Function, defaultListenerThisArg?: any);
    private __target_customEvent_handler;
    invoke(args?: object): void;
    readonly target: EventTarget;
    private __target;
    readonly eventName: string;
    private __eventName;
    destructor(): void;
}
export {};
