import { InvalidOperationException } from "../../Standard/index.js";
import { FrameworkEvent } from "../../Standard/Events/index.js";
import { Dictionary } from "../../Standard/Collections/index.js";

/**
 * FrameworkAction base class
 * Represents an user-initiated action.
 */
export abstract class Action {
    constructor() {
        if (this.constructor === Action) throw new InvalidOperationException("Invalid constructor");

        this.__ExecutedEvent = new FrameworkEvent();
    }

    execute(data?: Dictionary<string, any>): void {
        this.__ExecutedEvent.invoke(this, {
            data: data
        });
    }

    get ExecutedEvent() { return this.__ExecutedEvent; }
    private __ExecutedEvent: FrameworkEvent;
}