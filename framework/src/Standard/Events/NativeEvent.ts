import { FrameworkEventListener } from "./Events";
import { FrameworkEvent } from "./FrameworkEvent";

/**
 * NativeEvent class
 * Routes DOM Events, enabling native event integration.
 */
export class NativeEvent extends FrameworkEvent<Event> {
    constructor(target: EventTarget, nativeEventName: string, defaultListener?: FrameworkEventListener<Event>, defaultListenerThisArg?: any) {
        super(defaultListener, defaultListenerThisArg);

        this.__target = target;
        this.__nativeEventName = nativeEventName;
        this.__defaultListener = defaultListener;

        target.addEventListener(nativeEventName, this.__target_nativeEvent_handler);
    }

    private __target_nativeEvent_handler = ((event: Event): void => {
        this.invoke(this.target, { ...event });
    }).bind(this);

    get target(): EventTarget { return this.__target; }
    private __target: EventTarget;

    get nativeEventName(): string { return this.__nativeEventName; }
    private __nativeEventName: string;

    get defaultListener() { return this.__defaultListener; }
    private __defaultListener: FrameworkEventListener<Event> | undefined;

    destructor() {
        this.__target.removeEventListener(this.__nativeEventName, this.__target_nativeEvent_handler);

        super.destructor();
    }
}