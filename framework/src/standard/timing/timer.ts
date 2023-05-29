import { assert } from "../../validation/index.js";
import { FrameworkEvent, FrameworkEventArgs } from "../events/index.js";
import { Destructible } from "../index.js";

export class Timer extends Destructible {
    constructor() {
        super();

        this.#ElapsedEvent = new FrameworkEvent();
    }

    get isEnabled() { return this.#isEnabled; }
    set isEnabled(value) {
        if (value)
            this.#enable();
        else
            this.#disable();
    }
    #isEnabled: boolean = false;

    #enable() {
        this.#isEnabled = true;

        this.#doClear();
        this.#doSet();
    }

    #disable() {
        this.#isEnabled = false;

        this.#doClear();
    }

    #doClear() {
        clearTimeout(this.#timeoutHandle);
        this.#timeoutHandle = undefined;
    }

    #doSet() {
        this.#timeoutHandle = setTimeout(this.#timeoutCallback, this.interval);
    }

    #timeoutCallback = () => {
        this.#ElapsedEvent.invoke(this, new FrameworkEventArgs());

        if (this.#autoReset) {
            this.#doReset();
            return;
        }

        this.#disable();
    }

    #doReset() {
        this.#doClear();
        this.#doSet();
    }

    get autoReset() { return this.#autoReset; }
    set autoReset(value) {
        assert({ value }, [Boolean]);

        this.#autoReset = value;
    }
    #autoReset: boolean = false;

    get interval() { return this.#interval; }
    set interval(value) {
        assert({ value }, [Number]);

        this.#interval = value;
    }
    #interval: number = 0;

    get ElapsedEvent() { return this.#ElapsedEvent; }
    #ElapsedEvent: FrameworkEvent;

    #timeoutHandle?: number;

    protected _destructor(): void {
        this.#doClear();
    }
}