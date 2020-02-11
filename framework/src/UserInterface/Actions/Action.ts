import { InvalidOperationException, Destructible } from "../../Standard/index";
import { Dictionary, Collection } from "../../Standard/Collections/index";
import { EventTrigger } from "../Triggers/index";
import { assertParams } from "../../Validation/index";

const allActions: Collection<Action> = new Collection();

//Keys for Action
const $trigger = Symbol();

/**
 * FrameworkAction base class
 * Represents an user-initiated action.
 */
export abstract class Action extends Destructible {
    static getAll(): Action[] { return [...allActions]; }

    constructor() {
        super();

        if (this.constructor === Action)
            throw new InvalidOperationException("Invalid constructor");

        this[$trigger] = null;

        allActions.add(this);
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

    destructor() {
        if (this.trigger)
            this.trigger.actions.remove(this);

        allActions.remove(this);
    }
}