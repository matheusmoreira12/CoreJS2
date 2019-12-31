import { FrameworkEvent } from "../Standard/Events.js";
import { Destructible } from "../Standard/Destructible.js";

/**
 *
 */
export class Timer extends Destructible {
    constructor(delayMillis = 100, isPeriodic = true) {
        super();

        this.__delayMillis = delayMillis;
        this.__isPeriodic = isPeriodic;
        this.__TickEvent = new FrameworkEvent();
        this.__timeout_handle = null;
    }

    __timeout_handler = (() => {
        this.__TickEvent.invoke(this, {});

        if (this.isPeriodic)
            this.reset();
    }).bind(this);

    private __timeout_handle: number | null;

    reset() {
        this.stop();

        this.__timeout_handle = setTimeout(this.__timeout_handler, this.delayMillis);
    }
    stop() {
        if (!this.__timeout_handle)
            return;

        clearTimeout(this.__timeout_handle);
        this.__timeout_handle = null;
    }

    get delayMillis(): number { return this.__delayMillis; }
    private __delayMillis: number;

    get isPeriodic(): boolean { return this.__isPeriodic; }
    private __isPeriodic: boolean;

    get TickEvent(): FrameworkEvent { return this.__TickEvent; }
    private __TickEvent: FrameworkEvent;

    destructor() {
        this.stop();
        this.TickEvent.destruct();
    }
}
