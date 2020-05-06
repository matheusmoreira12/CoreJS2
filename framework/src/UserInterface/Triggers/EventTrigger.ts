import { FrameworkEvent, FrameworkEventArgs } from "../../Standard/Events/index.js";
import { Trigger } from "./index.js";
import { Dictionary } from "../../Standard/Collections/index.js";
import { Action, ActionCollection } from "../Actions/index.js";
import { assertParams, assertEachParams, TypeValidationMode } from "../../Validation/index.js";

//Keys for EventTrigger

/**
 * EventTrigger class
 * Triggers a group of actions upon the firing of an event.
 */
export class EventTrigger extends Trigger {
    constructor(targetEvent: FrameworkEvent, ...actions: Action[]) {
        super();

        assertParams({ targetEvent }, [FrameworkEvent]);
        assertEachParams({ actions }, [Action], TypeValidationMode.MatchAny, [Array]);

        this.__targetEvent = targetEvent;
        this.__actions = new ActionCollection(this, ...actions);

        this.targetEvent.attach(this.__targetEvent_handler);
    }

    private __removeAllActions() {
        const actionsCopy = [...this.actions];
        for (let action of actionsCopy)
            action.__setTrigger(null);
    }

    private __executeAllActions(data: Dictionary<string, any>) {
        const exceptions: Error[] = [];
        for (let action of this.actions) {
            try {
                action.execute(data);
            }
            catch (e) {
                exceptions.push(e);
            }
        }

        for (let e of exceptions)
            throw e;
    }

    private __targetEvent_handler(sender: any, args: FrameworkEventArgs) {
        const data: Dictionary<string, any> = Dictionary.fromKeyValueObject(args);
        data.set("origin", sender);
        
        this.__executeAllActions(data);
    }

    get targetEvent(): FrameworkEvent { return this.__targetEvent; }
    private __targetEvent: FrameworkEvent;

    get actions(): ActionCollection { return this.__actions; }
    private __actions: ActionCollection;

    protected destructor() {
        this.__removeAllActions();
    }
}