import { FrameworkEventListener, FrameworkEventArgs } from "./Events";
import { FrameworkEvent } from "./FrameworkEvent";
import { applyMixin } from "../../CoreBase/Utils/ObjectUtils";

export class NativeEventArgs<T extends Event> extends FrameworkEventArgs {
    constructor(target: EventTarget, event: Event) {
        Object.assign(this, event);
    }
}

export interface NativeEventArgs<T extends Event> extends FrameworkEventArgs, T {}

/**
 * NativeEvent class
 * Routes DOM Events, enabling native event integration.
 */
export class NativeEvent extends FrameworkEvent<NativeEventArgs> {
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