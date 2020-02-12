import { FrameworkEvent, FrameworkEventArgs } from "../../Standard/Events/index";
import { Trigger } from "./index";
import { ArgumentTypeException } from "../../Standard/index";
import { Dictionary, Collection } from "../../Standard/Collections/index";
import { Action, ActionCollection } from "../Actions/index";

/**
 * EventTrigger class
 * Triggers a group of actions upon the firing of an event.
 */
export class EventTrigger extends Trigger {
    constructor(targetEvent: FrameworkEvent, ...actions: Action[]) {
        super();

        if (!(targetEvent instanceof FrameworkEvent))
            throw new ArgumentTypeException("targetEvent", targetEvent, FrameworkEvent);

        this.__targetEvent = targetEvent;
        this.__actions = new ActionCollection(this, ...actions);

        targetEvent.attach(this.__targetEvent_handler, this);
    }

    private __targetEvent_handler(sender: any, args: FrameworkEventArgs) {
        this.__executeActions(Dictionary.fromKeyValueObject(args));
    }

    protected __executeActions(data: Dictionary<string, any>) {
        const executionErrors = [];

        for (let action of this.actions) {
            try {
                action.execute(data);
            }
            catch (e) {
                executionErrors.push(e);
            }
        }

        for (let e of executionErrors)
            throw e;
    }

    get targetEvent(): FrameworkEvent { return this.__targetEvent; }
    private __targetEvent: FrameworkEvent;

    get actions(): ActionCollection { return this.__actions; }
    private __actions: ActionCollection;

    private __removeAllActions() {
        const actionsCopy = [...this.actions];
        for (let action of actionsCopy)
            action.unsetTrigger();
    }
    
    protected destructor() {
        this.__removeAllActions();

        super.destructor();
    }
}