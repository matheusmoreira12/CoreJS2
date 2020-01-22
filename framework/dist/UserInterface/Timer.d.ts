import { FrameworkEvent, FrameworkEventArgs } from "../Standard/Events/index.js";
import { Destructible } from "../Standard/Destructible.js";
export declare class TickEvent extends FrameworkEventArgs {
}
export declare class Timer extends Destructible {
    constructor(delayMillis?: number, isPeriodic?: boolean);
    __timeout_handler: () => void;
    private __timeout_handle;
    private __reset;
    private __stop;
    get delayMillis(): number;
    private __delayMillis;
    get isPeriodic(): boolean;
    private __isPeriodic;
    get isEnabled(): boolean;
    set isEnabled(value: boolean);
    private __isEnabled;
    get TickEvent(): FrameworkEvent;
    private __TickEvent;
    destructor(): void;
}
