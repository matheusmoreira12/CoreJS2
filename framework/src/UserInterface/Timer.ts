import { FrameworkEvent, FrameworkEventArgs } from "../Standard/Events/index";
import { Destructible } from "../Standard/Destructible";

export class Timer extends Destructible {
    constructor(delayMillis = 100, isPeriodic = true) {
        super();

        this.__delayMillis = delayMillis;
        this.__isPeriodic = isPeriodic;
        this.__TickEvent = new FrameworkEvent();
        this.__timeout_handle = null;
    }

    __timeout_handler = (() => {
        this.__TickEvent.invoke(this, new FrameworkEventArgs());

        if (this.isPeriodic)
            this.__reset();
    }).bind(this);

    private __timeout_handle: number | null;

    private __reset() {
        this.__stop();

        this.__timeout_handle = setTimeout(this.__timeout_handler, this.delayMillis);
    }

    private __stop() {
        if (!this.__timeout_handle)
            return;

        clearTimeout(this.__timeout_handle);
        this.__timeout_handle = null;
    }

    get delayMillis(): number { return this.__delayMillis; }
    private __delayMillis: number;

    get isPeriodic(): boolean { return this.__isPeriodic; }
    private __isPeriodic: boolean;

    get isEnabled() { return this.__isEnabled; }
    set isEnabled(value) {
        if (value)
            this.__reset();
        else
            this.__stop();

        this.__isEnabled = value;
    }
    private __isEnabled: boolean = false;

    get TickEvent(): FrameworkEvent { return this.__TickEvent; }
    private __TickEvent: FrameworkEvent;

    destructor() {
        this.__stop();
        this.TickEvent.destruct();
    }
}
