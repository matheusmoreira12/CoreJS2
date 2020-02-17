import { InvalidOperationException, Destructible } from "../../Standard/index";
import { Dictionary, Collection } from "../../Standard/Collections/index";
import { EventTrigger } from "../Triggers/index";
import { assertParams } from "../../Validation/index";
import { $setTrigger, $unsetTrigger } from "./ActionCollection";

//Keys for Action
const $trigger = Symbol();

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

    [$setTrigger](trigger: EventTrigger) {
        this[$trigger] = trigger;
    }

    [$unsetTrigger]() {
        this[$trigger] = null;
    }

    get trigger(): EventTrigger | null { return this[$trigger]; }
    private [$trigger]: EventTrigger | null = null;

    destructor() {
        if (this.trigger)
            this.trigger.actions.remove(this);
    }
}