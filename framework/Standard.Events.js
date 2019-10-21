import { Collection } from "./standard";
import { ArgumentTypeException } from "./exceptions";
import { Type } from "./Standard.Types";
import { Destructible } from "./Standard.Destructible";

const workerMap = new WeakMap();

class FrameworkEventWorker extends Destructible {
    constructor(event) {
        this.event = event;
    }

    destructor() {
        this.detachAll();
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
        let isCanceled = false;

        let invokeErrors = [];

        let _args = {
            ...args,
            cancelEvent() { isCanceled = true; }
        }

        //Invoke each of the attached listeners
        for (let listener of this.listeners) {
            if (isCanceled) break;

            try {
                if (listener instanceof FrameworkEvent)
                    listener.invoke(sender, args);
                else if (listener instanceof Function)
                    listener(sender, args);
            }
            catch (e) {
                invokeErrors.push(e);
            }
        }

        for (let invokeError of invokeErrors) throw invokeError;
    }

    cancel() {
        this.isCanceled = true;
    }

    listeners = new Collection();
}

function createWorker(event) {
    let worker = new FrameworkEventWorker(event);
    workerMap.set(event, worker);
}

function deleteWorker(event) {
    let worker = workerMap.get(event);
    worker.destruct();

    workerMap.delete(event);
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

        this._isCanceled = false;

        createWorker(this);

        if (defaultListener) {
            if (defaultListener instanceof Function)
                this.attach(defaultListener);
            else
                throw new ArgumentTypeException("defaultListener", Type.get(Function));
        }
    }

    destructor() {
        deleteWorker(this);

        clearEventMetadata(this);
    }

    attach(listener) {
        if (!(listener instanceof Function) && (listener instanceof FrameworkEvent))
            throw new ArgumentTypeException("listener", Type.of(listener), [Type.get(Function), Type.get(FrameworkEvent)]);

        let worker = workerMap.get(this);
        if (!worker) return;

        worker.attach(listener);
    }

    detach(listener) {
        if (!(listener instanceof Function) && (listener instanceof FrameworkEvent))
            throw new ArgumentTypeException("listener", Type.of(listener), [Type.get(Function), Type.get(FrameworkEvent)]);

        let worker = workerMap.get(this);
        if (!worker) return;

        worker.detach(listener);
    }

    invoke(sender, args) {
        let worker = workerMap.get(this);
        if (!worker) return;

        worker.invoke(sender, args);
    }

    cancel() {
        let worker = workerMap.get(this);
        if (!worker) return;

        worker.cancel();
    }

    get isCanceled() {
        let worker = workerMap.get(this);
        if (!worker) return;

        return worker.isCanceled;
    }
}

/**
 * NativeEvent class
 * Routes DOM Events, enabling native event integration.
 */
export class NativeEvent extends FrameworkEvent {
    constructor(target, nativeEventName, defaultListener) {
        super(defaultListener);

        this._target = target;

        target.addEventListener(nativeEventName, this._nativeEvent_handler.bind(this));
    }

    _nativeEvent_handler(evt) {
        this.invoke(this, evt);
    }

    get target() { return this._target; }
}

/**
 * BroadcastFrameworkEvent Class
 * Enables the broadcasting of framework events.*/
export class BroadcastFrameworkEvent extends FrameworkEvent {
    static _transmitEvent(senderEvent, sender, args) {
        for (let registeredEvent of this._registeredEvents)
            registeredEvent._handleEvent(senderEvent, sender, args);
    }

    static _register(event) {
        this._registeredEvents.add(event);
    }

    static _registeredEvents = new Collection();

    constructor(name, defaultListener) {
        super(defaultListener);

        this._name = name;

        BroadcastFrameworkEvent._register(this);
    }

    _handleEvent(senderEvent, sender, args) {
        if (senderEvent._name === this._name)
            super.invoke(sender, args);
    }

    _routedEventsMap = new WeakMap();

    broadcast(sender, args) {
        this.invoke(sender, args);

        BroadcastFrameworkEvent._transmitEvent(this, sender, args);
    }

    route(baseEvent) {
        let routedEventsMap = this._routedEventsMap;
        let self = this;

        if (routedEventsMap.has(baseEvent)) return;

        function listener(sender, args) {
            self.broadcast(sender, args);
        }

        baseEvent.attach(listener);

        let data = {
            listener: listener
        };

        routedEventsMap.set(baseEvent, data);
    }

    unroute(baseEvent) {
        let routedEventsMap = this._routedEventsMap;

        if (!routedEventsMap.has(baseEvent)) return;

        let data = routedEvents.get(baseEvent);

        baseEvent.detach(data.listener);

        routedEventsMap.delete(baseEvent);
    }
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