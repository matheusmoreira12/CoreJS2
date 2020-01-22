import { Destructible } from "../index.js";
import { FrameworkEventArgs } from "./index.js";
import { FrameworkEventListener } from "./index.js";
import { Dictionary } from "../Collections/index.js";
declare type FrameworkEventListenerData = {
    thisArg: any;
};
/**
 * FrameworkEvent class
 * Enables event creation and manipulation, avoiding the use of callbacks.*/
export declare class FrameworkEvent<TArgs extends FrameworkEventArgs = FrameworkEventArgs> extends Destructible {
    static attachMultiple<TArgs extends object>(listener: FrameworkEventListener<TArgs>, ...events: FrameworkEvent<TArgs>[]): void;
    static detachMultiple<TArgs extends object>(listener: FrameworkEventListener<TArgs>, ...events: FrameworkEvent<TArgs>[]): void;
    constructor(defaultListener?: FrameworkEventListener<TArgs>, defaultListenerThisArg?: any);
    __detachAll(): void;
    attach(listener: FrameworkEventListener<TArgs> | FrameworkEvent<TArgs>, thisArg?: any): boolean;
    detach(listener: FrameworkEventListener<TArgs> | FrameworkEvent<TArgs>): boolean;
    protected __invokeListeners(sender: any, args: TArgs): void;
    invoke(sender: any, args: TArgs): void;
    __listeners: Dictionary<FrameworkEvent<TArgs> | FrameworkEventListener<TArgs>, FrameworkEventListenerData>;
    destructor(): void;
}
export {};
