import { FrameworkEvent, FrameworkEventListener } from "./index.js";
/**
 * FrameworkCustomEvent class
 * Simplifies DOM custom event creation and manipulation.*/
export declare class FrameworkCustomEvent<TArgs extends object> extends FrameworkEvent<TArgs> {
    constructor(target: EventTarget, eventName: string, defaultListener?: FrameworkEventListener<TArgs>, defaultListenerThisArg?: any);
    private __target_customEvent_handler;
    invoke(args: TArgs): void;
    get target(): EventTarget;
    private __target;
    get eventName(): string;
    private __eventName;
    destructor(): void;
}
