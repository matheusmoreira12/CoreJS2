import { Destructible } from "../../Standard/index.js";
import { InvalidOperationException } from "../../Standard/Exceptions/index.js"
import { Dictionary } from "../../Standard/Collections/index.js";
import { EventTrigger } from "../Triggers/index.js";

//Public keys for Action
export const $setTrigger = Symbol("setTrigger");

//Keys for Action
const $trigger = Symbol("trigger");

/**
 * FrameworkAction base class
 * Represents an user-initiated action.
 */
export abstract class Action extends Destructible {
    constructor() {
        super();

        if (this.constructor === Action)
            throw new InvalidOperationException("Invalid constructor");

        this[$trigger] = null;
    }

    abstract execute(data: Dictionary<string, any>): void;

    [$setTrigger](trigger: EventTrigger | null) {
        this[$trigger] = trigger;
    }

    get trigger(): EventTrigger | null { return this[$trigger]; }
    private [$trigger]: EventTrigger | null = null;

    destructor() {
        if (this.trigger)
            this.trigger.actions.remove(this);
    }
}