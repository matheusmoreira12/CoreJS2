import { ArgumentTypeException } from "./Exceptions.js";
import { Type } from "./Types/Types.js";
import { Destructible } from "./Destructible.js";
import { Dictionary } from "./Collections/Dictionary.js";
import { Collection } from "./Collections/Collection.js";

type FrameworkEventListener<TArgs extends object> = (sender: any, args: TArgs) => void;
type FrameworkEventListenerData = { thisArg: any };

/**
 * FrameworkEvent class
 * Enables event creation and manipulation, avoiding the use of callbacks.*/
export class FrameworkEvent<TArgs extends object> extends Destructible {
    static attachMultiple<TArgs extends object>(listener: FrameworkEventListener<TArgs>, ...events: FrameworkEvent<TArgs>[]): void {
        for (let event of events)
            event.attach(listener);
    }

    static detachMultiple<TArgs extends object>(listener: FrameworkEventListener<TArgs>, ...events: FrameworkEvent<TArgs>[]): void {
        for (let event of events)
            event.detach(listener);
    }

    constructor(defaultListener?: FrameworkEventListener<TArgs>, defaultListenerThisArg?: any) {
        super();

        if (defaultListener !== undefined) {
            if (defaultListener instanceof Function)
                this.attach(defaultListener, defaultListenerThisArg);
            else
                throw new ArgumentTypeException("defaultListener", Type.of(defaultListener), Type.get(Function));
        }
    }

    __detachAll(): void {
        for (let listener of this.__listeners)
            this.detach(listener.key);
    }

    attach(listener: FrameworkEventListener<TArgs> | FrameworkEvent<TArgs>, thisArg?: any): boolean {
        if (!(listener instanceof Function) && !(listener instanceof FrameworkEvent))
            throw new ArgumentTypeException("listener", Type.of(listener), [Type.get(Function), Type.get(FrameworkEvent)]);

        if (this.__listeners.has(listener))
            return false;

        this.__listeners.set(listener, {
            thisArg
        });
        return true;
    }

    detach(listener: FrameworkEventListener<TArgs> | FrameworkEvent<TArgs>): boolean {
        if (!(listener instanceof Function) && !(listener instanceof FrameworkEvent))
            throw new ArgumentTypeException("listener", Type.of(listener), [Type.get(Function), Type.get(FrameworkEvent)]);

        if (!this.__listeners.has(listener))
            return false;

        this.__listeners.delete(listener);
        return true;
    }

    protected __invokeListeners(sender: any, args: TArgs): void {
        let invokeErrors = [];

        let isPropagationStopped = false;

        let _args = {
            ...args,
            stopEventPropagation() { isPropagationStopped = true; }
        };

        //Invoke each of the attached listeners
        for (let { key: listener, value: data } of this.__listeners) {
            if (isPropagationStopped) break;

            try {
                if (listener instanceof FrameworkEvent)
                    listener.invoke(sender, _args);
                else if (listener instanceof Function)
                    listener.call(data.thisArg, sender, _args);
            }
            catch (e) {
                invokeErrors.push(e);
            }
        }

        for (let invokeError of invokeErrors) throw invokeError;
    }

    invoke(sender: any, args: TArgs): void {
        this.__invokeListeners(sender, args);
    }

    __listeners = new Dictionary<FrameworkEventListener<TArgs> | FrameworkEvent<TArgs>, FrameworkEventListenerData>();

    destructor() {
        this.__detachAll();
    }
}

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

/**
 * BroadcastFrameworkEvent Class
 * Enables the broadcasting of framework events.*/
export class BroadcastFrameworkEvent<TArgs extends object> extends FrameworkEvent<TArgs> {
    private static __EventBroadcastEvent: FrameworkEvent<any> = new FrameworkEvent();

    constructor(name: string, defaultListener?: FrameworkEventListener<TArgs>, defaultListenerThisArg?: any) {
        super(defaultListener, defaultListenerThisArg);

        this.__name = name;

        BroadcastFrameworkEvent.__EventBroadcastEvent.attach(this.__onEventBroadcast, this);
    }

    __onEventBroadcast(sender: any, args: any) {
        if (args.senderEventName === this.name)
            this.invoke(sender, args.originalArgs);
    }

    __onRoutedEvent(sender: any, args: TArgs) {
        this.broadcast(sender, args);
    }

    broadcast(sender: any, args: TArgs) {
        super.invoke(sender, args);

        BroadcastFrameworkEvent.__EventBroadcastEvent.invoke(sender, {
            originalArgs: args,
            senderEventName: this.__name
        });
    }

    route(baseEvent: FrameworkEvent<TArgs>) {
        if (!(baseEvent instanceof FrameworkEvent))
            throw new ArgumentTypeException("baseEvent");

        if (this.__routedEvents.indexOf(baseEvent) !== -1)
            return false;

        baseEvent.attach(this.__onRoutedEvent, this);
        this.__routedEvents.add(baseEvent);
        return true;
    }

    unroute(baseEvent: FrameworkEvent<TArgs>) {
        if (!(baseEvent instanceof FrameworkEvent))
            throw new ArgumentTypeException("baseEvent");

        if (this.__routedEvents.indexOf(baseEvent) == -1)
            return false;

        baseEvent.detach(this.__onRoutedEvent);
        this.__routedEvents.remove(baseEvent);
        return true;
    }

    unrouteAll() {
        for (let routedEvent of this.__routedEvents)
            this.unroute(routedEvent);
    }

    private __routedEvents: Collection<FrameworkEvent<TArgs>> = new Collection();

    get name(): string { return this.__name; }
    private __name: string;

    destrutor() {
        BroadcastFrameworkEvent.__EventBroadcastEvent.detach(this.__onEventBroadcast);

        super.destructor();
    }
}

/**
 * FrameworkCustomEvent class
 * Simplifies DOM custom event creation and manipulation.*/
export class FrameworkCustomEvent<TArgs extends object> extends FrameworkEvent<TArgs> {
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