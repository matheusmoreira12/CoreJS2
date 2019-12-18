import { Dictionary } from "./Collections";
import { ArgumentTypeException } from "./Exceptions";
import { Type } from "./Types/Types";
import { Destructible } from "./Destructible";

/**
 * FrameworkEvent class
 * Enables event creation and manipulation, avoiding the use of callbacks.*/
export class FrameworkEvent extends Destructible {
    static attachMultiple(listener, ...events) {
        for (let event of events)
            event.attach(listener);
    }

    static detachMultiple(listener, ...events) {
        for (let event of events)
            event.detach(listener);
    }

    constructor(defaultListener?, defaultListenerThisArg?) {
        super();

        if (defaultListener !== undefined) {
            if (defaultListener instanceof Function)
                this.attach(defaultListener, defaultListenerThisArg);
            else
                throw new ArgumentTypeException("defaultListener", Type.of(defaultListener), Type.get(Function));
        }
    }

    __detachAll() {
        for (let listener of this.__listeners)
            this.detach(listener);
    }

    attach(listener, thisArg?) {
        if (!(listener instanceof Function) && !(listener instanceof FrameworkEvent))
            throw new ArgumentTypeException("listener", Type.of(listener), [Type.get(Function), Type.get(FrameworkEvent)]);

        if (this.__listeners.has(listener))
            return false;

        this.__listeners.set(listener, {
            thisArg
        });
        return true;
    }

    detach(listener) {
        if (!(listener instanceof Function) && !(listener instanceof FrameworkEvent))
            throw new ArgumentTypeException("listener", Type.of(listener), [Type.get(Function), Type.get(FrameworkEvent)]);

        if (!this.__listeners.has(listener))
            return false;

        this.__listeners.delete(listener);
        return true;
    }

    invoke(sender, args) {
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

    __listeners = new Dictionary();

    destructor() {
        this.__detachAll();

        super.destruct();
    }
}

/**
 * NativeEvent class
 * Routes DOM Events, enabling native event integration.
 */
export class NativeEvent extends FrameworkEvent {
    constructor(targetElement: Element, nativeEventName: string, defaultListener?, defaultListenerThisArg?) {
        super(defaultListener, defaultListenerThisArg);

        this.__targetElement = targetElement;
        this.__nativeEventName = nativeEventName;
        this.__defaultListener = defaultListener;

        targetElement.addEventListener(nativeEventName, this.__bound_nativeEvent_handler);
    }

    private __nativeEvent_handler(evt) {
        this.invoke(this.targetElement, evt);
    }

    private __bound_nativeEvent_handler = this.__nativeEvent_handler.bind(this);

    get targetElement(): Element { return this.__targetElement; }
    private __targetElement: Element;

    get nativeEventName(): string { return this.__nativeEventName; }
    private __nativeEventName: string;

    get defaultListener() { return this.__defaultListener; }
    private __defaultListener;

    destructor() {
        this.__targetElement.removeEventListener(this.__nativeEventName, this.__bound_nativeEvent_handler);

        super.destructor();
    }
}

/**
 * BroadcastFrameworkEvent Class
 * Enables the broadcasting of framework events.*/
export class BroadcastFrameworkEvent extends FrameworkEvent {
    private static __EventBroadcastEvent = new FrameworkEvent();

    constructor(name: string, defaultListener?, defaultListenerThisArg?) {
        super(defaultListener, defaultListenerThisArg);

        this.__name = name;

        BroadcastFrameworkEvent.__EventBroadcastEvent.attach(this.__onEventBroadcast, this);
    }

    __onEventBroadcast = function (sender, args) {
        if (args.senderEventName === this.name)
            this.invoke(sender, args.originalArgs);
    }

    __onRoutedEvent = function (sender, args) {
        this.broadcast(sender, args);
    }

    broadcast(sender, args) {
        super.invoke(sender, args);

        BroadcastFrameworkEvent.__EventBroadcastEvent.invoke(sender, {
            originalArgs: args,
            senderEventName: this.__name
        });
    }

    route(baseEvent) {
        if (!(baseEvent instanceof FrameworkEvent))
            throw new ArgumentTypeException("baseEvent");

        if (this.__routedEvents.includes(baseEvent))
            return false;

        baseEvent.attach(this.__onRoutedEvent, this);
        this.__routedEvents.add(baseEvent);
        return true;
    }

    unroute(baseEvent) {
        if (!(baseEvent instanceof FrameworkEvent))
            throw new ArgumentTypeException("baseEvent");

        if (!this.__routedEvents.includes(baseEvent))
            return false;

        baseEvent.detach(this.__onRoutedEvent);
        this.__routedEvents.remove(baseEvent);
        return true;
    }

    unrouteAll() {
        for (let routedEvent of this.__routedEvents)
            this.unroute(routedEvent);
    }

    destrutor() {
        BroadcastFrameworkEvent.__EventBroadcastEvent.detach(this.__onEventBroadcast);
    }

    private __routedEvents = new Collection();

    get name(): string { return this.__name; }
    private __name: string;
}

/**
 * FrameworkCustomEvent class
 * Simplifies DOM custom event creation and manipulation.*/
export class FrameworkCustomEvent {
    constructor(target, type) {
        this.__target = target;
        this.__type = type;
    }

    _listenerMap = new WeakMap();

    invoke(args = {}) {
        let nativeEvent = new CustomEvent(this.__type, {
            bubbles: true,
            detail: args
        }); //Create a native custom event with the specified arguments

        //Fire the native custom event
        this.__target.dispatchEvent(nativeEvent);
    }

    attach(listener) {
        if (this._listenerMap.has(listener)) return; //Listener already attached. Do nothing.

        function handleNative(ev) { //Handle native event
            listener.call(this, ev.detail);
        }

        //Attach the native handler to the target element
        this.__target.addEventListener(this.__type, handleNative);

        //Set the attached listener entry
        this._listenerMap.set(listener, handleNative);
    }

    detach(listener) {
        if (!this._listenerMap.has(listener)) return; //No attached listener. Do nothing

        //Get the native handler
        let nativeHandler = this._listenerMap.get(listener);

        //Detach the native handler from the target element
        this.__target.removeEventListener(this.__type, nativeHandler);

        //Remove the previously attached listener entry
        this._listenerMap.delete(listener);
    }

    get target(): Element { return this.__target; }
    private __target: Element;

    get type(): string { return this.__type; }
    private __type: string;
}