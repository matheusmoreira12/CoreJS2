import { Destructible } from "../index.js";
import { FrameworkEventArgs } from "./index.js";
import { FrameworkEventListener } from "./index.js";
import { ArgumentTypeException } from "../index.js";
import { Dictionary } from "../Collections/index.js";

type FrameworkEventListenerData = { thisArg: any };

/**
 * FrameworkEvent class
 * Enables event creation and manipulation, avoiding the use of callbacks.*/
export class FrameworkEvent<TArgs extends FrameworkEventArgs = FrameworkEventArgs> extends Destructible {
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
                throw new ArgumentTypeException("defaultListener", defaultListener, Function);
        }
    }

    __detachAll(): void {
        for (let listener of this.__listeners)
            this.detach(listener.key);
    }

    attach(listener: FrameworkEventListener<TArgs> | FrameworkEvent<TArgs>, thisArg?: any): boolean {
        if (!(listener instanceof Function) && !(listener instanceof FrameworkEvent))
            throw new ArgumentTypeException("listener", listener, [Function, FrameworkEvent]);

        if (this.__listeners.has(listener))
            return false;

        this.__listeners.set(listener, {
            thisArg
        });
        return true;
    }

    detach(listener: FrameworkEventListener<TArgs> | FrameworkEvent<TArgs>): boolean {
        if (!(listener instanceof Function) && !(listener instanceof FrameworkEvent))
            throw new ArgumentTypeException("listener", listener, [Function, FrameworkEvent]);

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
