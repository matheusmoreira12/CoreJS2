import { Destructible } from "../../Standard/index.js";
import { InvalidOperationException } from "../../Standard/Exceptions/index.js"
import { Dictionary } from "../../Standard/Collections/index.js";
import { EventTrigger } from "../Triggers/index.js";

/**
 * FrameworkAction base class
 * Represents an user-initiated action.
 */
export abstract class Action extends Destructible {
    constructor() {
        super();

        if (this.constructor === Action)
            throw new InvalidOperationException("Invalid constructor");

        this.__trigger = null;
    }

    abstract execute(data: Dictionary<string, any>): void;

    __setTrigger(trigger: EventTrigger | null) {
        this.__trigger = trigger;
    }

    get trigger(): EventTrigger | null { return this.__trigger; }
    private __trigger: EventTrigger | null = null;

    destructor() {
        if (this.trigger)
            this.trigger.actions.remove(this);
    }
}