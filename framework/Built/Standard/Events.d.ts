import { Dictionary } from "./Collections";
import { Destructible } from "./Destructible";
/**
 * FrameworkEvent class
 * Enables event creation and manipulation, avoiding the use of callbacks.*/
export declare class FrameworkEvent extends Destructible {
    static attachMultiple(listener: any, ...events: any[]): void;
    static detachMultiple(listener: any, ...events: any[]): void;
    constructor(defaultListener?: any, defaultListenerThisArg?: any);
    __detachAll(): void;
    attach(listener: any, thisArg?: any): boolean;
    detach(listener: any): boolean;
    invoke(sender: any, args: any): void;
    __listeners: Dictionary<unknown, unknown>;
    destructor(): void;
}
/**
 * NativeEvent class
 * Routes DOM Events, enabling native event integration.
 */
export declare class NativeEvent extends FrameworkEvent {
    constructor(targetElement: Element, nativeEventName: string, defaultListener?: any, defaultListenerThisArg?: any);
    private __nativeEvent_handler;
    private __bound_nativeEvent_handler;
    readonly targetElement: Element;
    private __targetElement;
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
    broadcast(sender: any, args: any): void;
    route(baseEvent: any): boolean;
    unroute(baseEvent: any): boolean;
    unrouteAll(): void;
    destrutor(): void;
    private __routedEvents;
    readonly name: string;
    private __name;
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
    readonly target: Element;
    private __target;
    readonly type: string;
    private __type;
}
