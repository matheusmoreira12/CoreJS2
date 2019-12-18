import { Dictionary, Collection } from "./Collections";
import { ArgumentTypeException } from "./Exceptions";
import { Type } from "./Types/Types";
import { Destructible } from "./Destructible";
/**
 * FrameworkEvent class
 * Enables event creation and manipulation, avoiding the use of callbacks.*/
export class FrameworkEvent extends Destructible {
    constructor(defaultListener, defaultListenerThisArg) {
        super();
        this.__listeners = new Dictionary();
        if (defaultListener !== undefined) {
            if (defaultListener instanceof Function)
                this.attach(defaultListener, defaultListenerThisArg);
            else
                throw new ArgumentTypeException("defaultListener", Type.of(defaultListener), Type.get(Function));
        }
    }
    static attachMultiple(listener, ...events) {
        for (let event of events)
            event.attach(listener);
    }
    static detachMultiple(listener, ...events) {
        for (let event of events)
            event.detach(listener);
    }
    __detachAll() {
        for (let listener of this.__listeners)
            this.detach(listener);
    }
    attach(listener, thisArg) {
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
    __invokeListeners(sender, args) {
        let invokeErrors = [];
        let isPropagationStopped = false;
        let _args = Object.assign(Object.assign({}, args), { stopEventPropagation() { isPropagationStopped = true; } });
        //Invoke each of the attached listeners
        for (let { key: listener, value: data } of this.__listeners) {
            if (isPropagationStopped)
                break;
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
        for (let invokeError of invokeErrors)
            throw invokeError;
    }
    invoke(sender, args) {
        this.__invokeListeners(sender, args);
    }
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
    constructor(target, nativeEventName, defaultListener, defaultListenerThisArg) {
        super(defaultListener, defaultListenerThisArg);
        this.__nativeEvent_handler = ((event) => {
            this.invoke(this.target, event);
        }).bind(this);
        this.__target = target;
        this.__nativeEventName = nativeEventName;
        this.__defaultListener = defaultListener;
        target.addEventListener(nativeEventName, this.__nativeEvent_handler);
    }
    get target() { return this.__target; }
    get nativeEventName() { return this.__nativeEventName; }
    get defaultListener() { return this.__defaultListener; }
    destructor() {
        this.__target.removeEventListener(this.__nativeEventName, this.__nativeEvent_handler);
        super.destructor();
    }
}
/**
 * BroadcastFrameworkEvent Class
 * Enables the broadcasting of framework events.*/
export class BroadcastFrameworkEvent extends FrameworkEvent {
    constructor(name, defaultListener, defaultListenerThisArg) {
        super(defaultListener, defaultListenerThisArg);
        this.__onEventBroadcast = function (sender, args) {
            if (args.senderEventName === this.name)
                this.invoke(sender, args.originalArgs);
        };
        this.__onRoutedEvent = function (sender, args) {
            this.broadcast(sender, args);
        };
        this.__routedEvents = new Collection();
        this.__name = name;
        BroadcastFrameworkEvent.__EventBroadcastEvent.attach(this.__onEventBroadcast, this);
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
        if (this.__routedEvents.indexOf(baseEvent) !== -1)
            return false;
        baseEvent.attach(this.__onRoutedEvent, this);
        this.__routedEvents.add(baseEvent);
        return true;
    }
    unroute(baseEvent) {
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
    get name() { return this.__name; }
    destrutor() {
        BroadcastFrameworkEvent.__EventBroadcastEvent.detach(this.__onEventBroadcast);
    }
}
BroadcastFrameworkEvent.__EventBroadcastEvent = new FrameworkEvent();
/**
 * FrameworkCustomEvent class
 * Simplifies DOM custom event creation and manipulation.*/
export class FrameworkCustomEvent extends FrameworkEvent {
    constructor(target, eventName, defaultListener, defaultListenerThisArg) {
        super(defaultListener, defaultListenerThisArg);
        this.__target_customEvent_handler = ((event) => {
            this.__invokeListeners(event.target, event.detail);
        }).bind(this);
        this.__target = target;
        this.__eventName = eventName;
        this.__target.addEventListener(eventName, this.__target_customEvent_handler);
    }
    invoke(args) {
        let nativeEvent = new CustomEvent(this.__eventName, {
            bubbles: true,
            detail: args
        }); //Create a native custom event with the specified arguments
        //Fire the native custom event
        super.invoke(nativeEvent, args);
    }
    get target() { return this.__target; }
    get eventName() { return this.__eventName; }
    destructor() {
        this.__target.removeEventListener(this.__eventName, this.__target_customEvent_handler);
    }
}
