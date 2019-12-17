import { ArgumentTypeException, InvalidOperationException, ArgumentException } from "./exceptions.js";
import { Type } from "./Standard.Types.js";
import { Destructible } from "./Standard.Destructible.js";
import { Worker } from "./Standard.Workers.js";
import { Collection, Dictionary } from "./Standard.Collections.js";

class FrameworkEventWorker extends Worker {
    initialize(defaultListener, defaultListenerThisArg) {
        super.initialize();

        if (defaultListener !== null) {
            if (defaultListener instanceof Function)
                this.attach(defaultListener, defaultListenerThisArg);
            else
                throw new ArgumentTypeException("defaultListener", Type.of(defaultListener), Type.get(Function));
        }
    }

    finalize() {
        this.detachAll();

        super.finalize();
    }

    _includesListener(listener) {
        return this.listeners.some(d => d.listener === listener);
    }

    attach(listener, thisArg) {
        if (this.listeners.has(listener))
            return false;

        this.listeners.set(listener, {
            thisArg
        });
        return true;
    }

    detach(listener) {
        if (!listeners.has(listener))
            return false;

        this.listeners.delete(listener);
        return true;
    }

    detachAll() {
        for (let listener of this.listeners)
            this.detach(listener);
    }

    invoke(sender, args) {
        let invokeErrors = [];

        let isPropagationStopped = false;

        let _args = {
            ...args,
            stopEventPropagation() { isPropagationStopped = true; }
        };

        //Invoke each of the attached listeners
        for (let { key: listener, value: data } of this.listeners) {
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

    //Exposed Methods
    do_attach(listener, thisArg = undefined) {
        if (!(listener instanceof Function) && !(listener instanceof FrameworkEvent))
            throw new ArgumentTypeException("listener", Type.of(listener), [Type.get(Function), Type.get(FrameworkEvent)]);

        return this.attach(listener, thisArg);
    }

    do_detach(listener) {
        if (!(listener instanceof Function) && !(listener instanceof FrameworkEvent))
            throw new ArgumentTypeException("listener", Type.of(listener), [Type.get(Function), Type.get(FrameworkEvent)]);

        return this.detach(listener);
    }

    do_invoke(sender, args) {
        this.invoke(sender, args);
    }

    listeners = new Dictionary();
}

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

    constructor(defaultListener = null, defaultListenerThisArg = undefined) {
        super();

        Worker.create(this, FrameworkEventWorker, defaultListener, defaultListenerThisArg);
    }

    destructor() {
        Worker.delete(this);
    }
}

export class NativeEventWorker extends FrameworkEventWorker {
    initialize(targetElement, nativeEventName, defaultListener, defaultListenerThisArg) {
        super.initialize(defaultListener, defaultListenerThisArg);

        this.targetElement = targetElement;
        this.nativeEventName = nativeEventName;
        this.defaultListener = defaultListener;

        targetElement.addEventListener(nativeEventName, this.bound_nativeEvent_handler);
    }

    //Exposed Methods
    nativeEvent_handler(evt) {
        this.invoke(this.targetElement, evt);
    }

    bound_nativeEvent_handler = this.nativeEvent_handler.bind(this);

    finalize() {
        this.targetElement.removeEventListener(this.nativeEventName, this.bound_nativeEvent_handler);

        super.finalize();
    }
}

/**
 * NativeEvent class
 * Routes DOM Events, enabling native event integration.
 */
export class NativeEvent extends FrameworkEvent {
    constructor(targetElement, nativeEventName, defaultListener = null, defaultListenerThisArg = undefined) {
        super(defaultListener, defaultListenerThisArg);

        Worker.override(this, NativeEventWorker, targetElement, nativeEventName, defaultListener, defaultListenerThisArg);
    }

    get targetElement() { return this._targetElement; }
}

class BroadcastFrameworkEventWorker extends FrameworkEventWorker {
    static EventBroadcastEvent = new FrameworkEvent();

    constructor(self) {
        super(self);

        this.onEventBroadcast = function (sender, args) {
            if (args.senderEventName === this.name)
                this.invoke(sender, args.originalArgs);
        };

        this.onRoutedEvent = function (sender, args) {
            this.broadcast(sender, args);
        };
    }

    initialize(name, defaultListener, defaultListenerThisArg) {
        super.initialize(defaultListener, defaultListenerThisArg);

        this.name = name;

        BroadcastFrameworkEventWorker.EventBroadcastEvent.attach(this.onEventBroadcast, this);
    }

    broadcast(sender, args) {
        this.invoke(sender, args);

        BroadcastFrameworkEventWorker.EventBroadcastEvent.invoke(sender, {
            originalArgs: args,
            senderEventName: this.name
        });
    }

    route(baseEvent) {
        if (this.routedEvents.includes(baseEvent))
            return false;

        baseEvent.attach(this.onRoutedEvent, this);
        this.routedEvents.add(baseEvent);
        return true;
    }

    unroute(baseEvent) {
        if (!this.routedEvents.includes(baseEvent))
            return false;

        baseEvent.detach(this.onRoutedEvent);
        this.routedEvents.remove(baseEvent);
        return true;
    }

    unrouteAll() {
        for (let routedEvent of this.routedEvents)
            this.unroute(routedEvent);
    }

    finalize() {
        BroadcastFrameworkEventWorker.EventBroadcastEvent.detach(this.onEventBroadcast, this);

        this.unrouteAll();

        super.finalize();
    }

    //Exposed Methods
    do_route(baseEvent) {
        if (!(baseEvent instanceof FrameworkEvent))
            throw new ArgumentTypeException("baseEvent");

        return this.route(baseEvent);
    }

    do_unroute(baseEvent) {
        if (!(baseEvent instanceof FrameworkEvent))
            throw new ArgumentTypeException("baseEvent");

        return this.route(baseEvent);
    }

    do_broadcast(sender, args) {
        this.broadcast(sender, args);
    }

    get_name() {
        return this.name;
    }

    routedEvents = new Collection();
}

/**
 * BroadcastFrameworkEvent Class
 * Enables the broadcasting of framework events.*/
export class BroadcastFrameworkEvent extends FrameworkEvent {
    constructor(name, defaultListener = null, defaultListenerThisArg = undefined) {
        super(defaultListener, defaultListenerThisArg);

        Worker.override(this, BroadcastFrameworkEventWorker, name, defaultListener, defaultListenerThisArg);
    }
}

class FrameworkCustomEventWorker extends FrameworkEventWorker {

}

/**
 * FrameworkCustomEvent class
 * Simplifies DOM custom event creation and manipulation.*/
export class FrameworkCustomEvent {
    constructor(target, type) {
        this._target = target;
        this._type = type;
    }

    _listenerMap = new WeakMap();

    invoke(args = {}) {
        let nativeEvent = new CustomEvent(this._type, {
            bubbles: true,
            detail: args
        }); //Create a native custom event with the specified arguments

        //Fire the native custom event
        this._target.dispatchEvent(nativeEvent);
    }

    attach(listener) {
        if (this._listenerMap.has(listener)) return; //Listener already attached. Do nothing.

        function handleNative(ev) { //Handle native event
            listener.call(this, ev.detail);
        }

        //Attach the native handler to the target element
        this._target.addEventListener(this._type, handleNative);

        //Set the attached listener entry
        this._listenerMap.set(listener, handleNative);
    }

    detach(listener) {
        if (!this._listenerMap.has(listener)) return; //No attached listener. Do nothing

        //Get the native handler
        let nativeHandler = this._listenerMap.get(listener);

        //Detach the native handler from the target element
        this._target.removeEventListener(this._type, nativeHandler);

        //Remove the previously attached listener entry
        this._listenerMap.delete(listener);
    }
}