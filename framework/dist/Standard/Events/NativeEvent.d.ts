import { FrameworkEventListener } from "./Events.js";
import { FrameworkEvent } from "./FrameworkEvent.js";
/**
 * NativeEvent class
 * Routes DOM Events, enabling native event integration.
 */
export declare class NativeEvent extends FrameworkEvent<Event> {
    constructor(target: EventTarget, nativeEventName: string, defaultListener?: FrameworkEventListener<Event>, defaultListenerThisArg?: any);
    private __target_nativeEvent_handler;
    get target(): EventTarget;
    private __target;
    get nativeEventName(): string;
    private __nativeEventName;
    get defaultListener(): FrameworkEventListener<Event> | undefined;
    private __defaultListener;
    destructor(): void;
}
