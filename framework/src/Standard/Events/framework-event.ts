import { Destructible } from "../Destructible.js";
import { FrameworkEventArgs } from "./index.js";
import { Dictionary } from "../Collections/Dictionary.js";
import { assertParams } from "../../ValidationStandalone/index.js";

export type FrameworkEventListener<TArgs extends object> = (sender: any, args: TArgs) => void;

type FrameworkEventListenerData = { thisArg: any };

/**
 * FrameworkEvent class
 * Enables event creation and manipulation, avoiding the use of callbacks.*/
export class FrameworkEvent<TArgs extends FrameworkEventArgs = FrameworkEventArgs> extends Destructible {
    static attachMultiple<TArgs extends FrameworkEventArgs>(listener: FrameworkEventListener<TArgs>, ...events: FrameworkEvent<TArgs>[]): void {
        assertParams({ listener }, [Function, FrameworkEvent]);
        assertParams({ events }, [Array]);

        for (let event of events)
            event.attach(listener);
    }

    static detachMultiple<TArgs extends FrameworkEventArgs>(listener: FrameworkEventListener<TArgs>, ...events: FrameworkEvent<TArgs>[]): void {
        assertParams({ listener }, [Function, FrameworkEvent]);
        assertParams({ events }, [Array]);

        for (let event of events)
            event.detach(listener);
    }

    constructor(defaultListener?: FrameworkEventListener<TArgs>, defaultListenerThisArg?: any) {
        super();

        assertParams({ defaultListener }, [Function, FrameworkEvent, undefined]);

        if (defaultListener !== undefined)
            this.attach(defaultListener, defaultListenerThisArg);
    }

    __detachAll(): void {
        for (let listener of this.__listeners)
            this.detach(listener.key);
    }

    attach(event: FrameworkEvent<TArgs>): boolean;
    attach(listener: FrameworkEventListener<TArgs>, thisArg?: any): boolean;
    attach(listener: FrameworkEventListener<TArgs> | FrameworkEvent<TArgs>, thisArg?: any): boolean {
        assertParams({ listener }, [FrameworkEvent, Function]);

        if (this.__listeners.has(listener))
            return false;

        this.__listeners.set(listener, {
            thisArg
        });
        return true;
    }

    detach(listener: FrameworkEventListener<TArgs> | FrameworkEvent<TArgs>): boolean {
        assertParams({ listener }, [FrameworkEvent, Function]);

        if (!this.__listeners.has(listener))
            return false;

        this.__listeners.delete(listener);
        return true;
    }

    protected __invokeListeners(sender: any, args: TArgs): void {
        let invokeErrors = [];

        //Invoke each of the attached listeners
        for (let { key: listener, value: data } of this.__listeners) {
            try {
                if (listener instanceof FrameworkEvent)
                    listener.invoke(sender, args);
                else if (listener instanceof Function)
                    listener.call(data.thisArg, sender, args);
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
