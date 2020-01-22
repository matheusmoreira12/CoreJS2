import { FrameworkEvent, FrameworkEventListener } from "./index.js";
/**
 * BroadcastFrameworkEvent Class
 * Enables the broadcasting of framework events.*/
export declare class BroadcastFrameworkEvent<TArgs extends object> extends FrameworkEvent<TArgs> {
    private static __EventBroadcastEvent;
    constructor(name: string, defaultListener?: FrameworkEventListener<TArgs>, defaultListenerThisArg?: any);
    __onEventBroadcast(sender: any, args: any): void;
    __onRoutedEvent(sender: any, args: TArgs): void;
    broadcast(sender: any, args: TArgs): void;
    route(baseEvent: FrameworkEvent<TArgs>): boolean;
    unroute(baseEvent: FrameworkEvent<TArgs>): boolean;
    unrouteAll(): void;
    private __routedEvents;
    get name(): string;
    private __name;
    destrutor(): void;
}
