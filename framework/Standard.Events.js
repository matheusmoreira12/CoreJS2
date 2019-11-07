import { Collection } from "./Standard.Collections.js";
import { ArgumentTypeException, InvalidOperationException, ArgumentException } from "./exceptions.js";
import { Type } from "./Standard.Types.js";
import { Destructible } from "./Standard.Destructible.js";
import { Worker } from "./Standard.Workers.js";

class FrameworkEventWorker extends Worker {
    initialize(defaultListener) {
        if (defaultListener) {
            if (defaultListener instanceof Function)
                this.attach(defaultListener);
            else
                throw new ArgumentTypeException("defaultListener", Type.get(Function));
        }
    }

    finalize() {
        this.detachAll();

        super.finalize();
    }

    attach(listener) {
        this.listeners.add(listener);
    }

    detach(listener) {
        this.listeners.remove(listener);
    }

    detachAll() {
        for (let listener of listeners)
            this.detach(listener);
    }

    invoke(sender, args) {
        let isPropagationStopped = false;

        let invokeErrors = [];

        let _args = {
            ...args,
            stopEventPropagation() { isPropagationStopped = true; }
        };

        //Invoke each of the attached listeners
        for (let listener of this.listeners) {
            if (isPropagationStopped) break;

            try {
                if (listener instanceof FrameworkEvent)
                    listener.invoke(sender, _args);
                else if (listener instanceof Function)
                    listener(sender, _args);
            }
            catch (e) {
                invokeErrors.push(e);
            }
        }

        for (let invokeError of invokeErrors) throw invokeError;
    }

    listeners = new Collection();
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

    constructor(defaultListener) {
        super();

        this._isPropagationStopped = false;

        Worker.create(this, FrameworkEventWorker, defaultListener);
    }

    destructor() {
        let worker = Worker.retrieve(this);
        if (!worker) return;

        worker.detachAll();

        Worker.delete(this);
    }

    attach(listener) {
        if (!(listener instanceof Function) && !(listener instanceof FrameworkEvent))
            throw new ArgumentTypeException("listener", Type.of(listener), [Type.get(Function), Type.get(FrameworkEvent)]);

        let worker = Worker.retrieve(this, FrameworkEventWorker);
        if (!worker) return;

        worker.attach(listener);
    }

    detach(listener) {
        if (!(listener instanceof Function) && !(listener instanceof FrameworkEvent))
            throw new ArgumentTypeException("listener", Type.of(listener), [Type.get(Function), Type.get(FrameworkEvent)]);

        let worker = Worker.retrieve(this, FrameworkEventWorker);
        if (!worker) return;

        worker.detach(listener);
    }

    invoke(sender, args) {
        let worker = Worker.retrieve(this, FrameworkEventWorker);
        if (!worker) return;

        worker.invoke(sender, args);
    }
}

export class NativeEventWorker extends FrameworkEventWorker {
    initialize(targetElement, nativeEventName, defaultListener) {
        super.initialize(defaultListener);

        this.targetElement = targetElement;
        this.nativeEventName = nativeEventName;
        this.defaultListener = defaultListener;

        targetElement.addEventListener(nativeEventName, this.bound_nativeEvent_handler);
    }

    nativeEvent_handler(evt) {
        this.invoke(this.targetElement, evt);
    }

    bound_nativeEvent_handler = this.nativeEvent_handler.bind(this);

    finalize() {
        super.finalize();

        this.targetElement.removeEventListener(this.nativeEventName, this.bound_nativeEvent_handler);
    }
}

/**
 * NativeEvent class
 * Routes DOM Events, enabling native event integration.
 */
export class NativeEvent extends FrameworkEvent {
    constructor(targetElement, nativeEventName, defaultListener) {
        super(defaultListener);

        Worker.override(this, NativeEventWorker, targetElement, nativeEventName, defaultListener);
    }

    get targetElement() { return this._targetElement; }
}

class BroadcastFrameworkEventWorker extends FrameworkEventWorker {
    static EventBroadcastEvent = new FrameworkEvent();

    initialize(name, defaultListener) {
        super.initialize(defaultListener);

        this.name = name;

        BroadcastFrameworkEventWorker.EventBroadcastEvent.attach(this.bound_onEventBroadcast);
    }

    finalize() {
        BroadcastFrameworkEventWorker.EventBroadcastEvent.detach(this.bound_onEventBroadcast);

        this.unrouteAll();

        super.finalize();
    }

    onEventBroadcast(sender, args) {
        let senderEventWorker = args.senderEventWorker;

        if (senderEventWorker.name === this.name)
            this.invoke(sender, args.originalArgs);
    }

    bound_onEventBroadcast = this.onEventBroadcast.bind(this);

    broadcast(sender, args) {
        this.invoke(sender, args);

        BroadcastFrameworkEventWorker.EventBroadcastEvent.invoke(sender, {
            originalArgs: args,
            senderEventWorker: this
        });
    }

    onRoutedEvent(sender, args) {
        this.broadcast(sender, args);
    }

    bound_onRoutedEvent = this.onRoutedEvent.bind(this);

    route(baseEvent) {
        if (this.routedEvents.includes(baseEvent)) return;

        if (!(baseEvent instanceof FrameworkEvent)) throw new ArgumentTypeException("baseEvent");
        baseEvent.attach(this.bound_onRoutedEvent);

        this.routedEvents.add(baseEvent);
    }

    unroute(baseEvent) {
        if (!(baseEvent instanceof FrameworkEvent)) throw new ArgumentTypeException("baseEvent");

        if (!this.routedEvents.includes(baseEvent)) return;

        baseEvent.detach(this.bound_onRoutedEvent);

        this.routedEvents.remove(baseEvent);
    }

    unrouteAll() {
        for (let routedEvent of this.routedEvents)
            this.unroute(routedEvent);
    }

    routedEvents = new Collection();
}

/**
 * BroadcastFrameworkEvent Class
 * Enables the broadcasting of framework events.*/
export class BroadcastFrameworkEvent extends FrameworkEvent {

    constructor(name, defaultListener) {
        super(defaultListener);

        this._name = name;

        Worker.override(this, BroadcastFrameworkEventWorker, name, defaultListener);
    }

    broadcast(sender, args) {
        const worker = Worker.retrieve(this, BroadcastFrameworkEventWorker);
        if (!worker) return;

        worker.broadcast(sender, args);
    }

    route(baseEvent) {
        const worker = Worker.retrieve(this, BroadcastFrameworkEventWorker);
        if (!worker) return;

        worker.route(baseEvent);
    }

    unroute(baseEvent) {
        const worker = Worker.retrieve(this, BroadcastFrameworkEventWorker);
        if (!worker) return;

        worker.unroute(baseEvent);
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
            detail: {
                args: args
            }
        }); //Create a native custom event with the specified arguments

        //Fire the native custom event
        this._target.dispatchEvent(nativeEvent);
    }

    attach(listener) {
        if (this._listenerMap.has(listener)) return; //Listener already attached. Do nothing.

        function handleNative(ev) { //Handle native event
            listener.call(this, ev.detail.args);
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