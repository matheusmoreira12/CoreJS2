import { FrameworkEvent, FrameworkEventListener } from "./FrameworkEvent.js";
import { NativeEventArgs } from "./NativeEventArgs.js";

type NativeEventListener = FrameworkEventListener<NativeEventArgs>;

/**
 * NativeEvent class
 * Routes DOM Events, enabling native event integration.
 */
export class NativeEvent extends FrameworkEvent<NativeEventArgs> {
    constructor(target: EventTarget, nativeEventName: string, defaultListener?: NativeEventListener, defaultListenerThisArg?: any) {
        super(defaultListener, defaultListenerThisArg);

        this.__target = target;
        this.__nativeEventName = nativeEventName;
        this.__defaultListener = defaultListener;

        target.addEventListener(nativeEventName, this.__target_nativeEvent_handler);
    }

    private __target_nativeEvent_handler = ((event: Event): void => {
        this.invoke(this.target, new NativeEventArgs(this, event));
    }).bind(this);

    get target(): EventTarget { return this.__target; }
    private __target: EventTarget;

    get nativeEventName(): string { return this.__nativeEventName; }
    private __nativeEventName: string;

    get defaultListener() { return this.__defaultListener; }
    private __defaultListener: NativeEventListener | undefined;

    destructor() {
        this.__target.removeEventListener(this.__nativeEventName, this.__target_nativeEvent_handler);

        super.destructor();
    }
}