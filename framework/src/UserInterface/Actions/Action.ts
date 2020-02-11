import { InvalidOperationException } from "../../Standard/index";
import { Dictionary } from "../../Standard/Collections/index";
import { EventTrigger } from "../Triggers/index";
import { assertParams } from "../../Validation/index";

//Keys for Action
const $trigger = Symbol();

/**
 * FrameworkAction base class
 * Represents an user-initiated action.
 */
export abstract class Action {
    constructor() {
        if (this.constructor === Action)
            throw new InvalidOperationException("Invalid constructor");

        this[$trigger] = null;
    }

    abstract execute(data: Dictionary<string, any>): void;

    setTrigger(trigger: EventTrigger) {
        assertParams({ trigger }, EventTrigger);

        this[$trigger] = trigger;
    }

    unsetTrigger() {
        this[$trigger] = null;
    }

    get trigger(): EventTrigger | null { return this[$trigger]; }
    private [$trigger]: EventTrigger | null = null;
}