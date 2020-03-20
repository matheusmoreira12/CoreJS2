import { InvalidOperationException, Destructible } from "../../Standard/index";
import { Dictionary } from "../../Standard/Collections/index";
import { EventTrigger } from "../Triggers/index";

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