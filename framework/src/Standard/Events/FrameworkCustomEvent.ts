import { FrameworkEvent, FrameworkEventListener } from "./index.js";
import { FrameworkEventArgs } from "./Events.js";

/**
 * FrameworkCustomEvent class
 * Simplifies DOM custom event creation and manipulation.*/
export class FrameworkCustomEvent<TArgs extends FrameworkEventArgs> extends FrameworkEvent<TArgs> {
    constructor(target: EventTarget, eventName: string, defaultListener?: FrameworkEventListener<TArgs>, defaultListenerThisArg?: any) {
        super(defaultListener, defaultListenerThisArg);

        this.__target = target;
        this.__eventName = eventName;

        this.__target.addEventListener(eventName, this.__target_customEvent_handler);
    }

    private __target_customEvent_handler = ((event: Event) => {
        this.__invokeListeners(event.target, <TArgs>(<CustomEvent>event).detail)
    }).bind(this);

    invoke(args: TArgs) {
        let nativeEvent = new CustomEvent(this.__eventName, {
            bubbles: true,
            detail: args
        }); //Create a native custom event with the specified arguments

        //Fire the native custom event
        super.invoke(nativeEvent, args);
    }

    get target(): EventTarget { return this.__target }
    private __target: EventTarget;

    get eventName(): string { return this.__eventName; }
    private __eventName: string;

    destructor() {
        this.__target.removeEventListener(this.__eventName, this.__target_customEvent_handler);

        super.destructor();
    }
}