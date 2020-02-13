import { FrameworkEvent, FrameworkEventArgs } from "../../Standard/Events/index";
import { Trigger } from "./index";
import { ArgumentTypeException } from "../../Standard/index";
import { Dictionary, Collection } from "../../Standard/Collections/index";
import { Action, ActionCollection } from "../Actions/index";

//Keys for EventTrigger
const $targetEvent = Symbol();
const $actions = Symbol();
const $removeAllActions = Symbol();
const $executeAllActions = Symbol();
const $targetEvent_handler = Symbol();

/**
 * EventTrigger class
 * Triggers a group of actions upon the firing of an event.
 */
export class EventTrigger extends Trigger {
    constructor(targetEvent: FrameworkEvent, ...actions: Action[]) {
        super();

        if (!(targetEvent instanceof FrameworkEvent))
            throw new ArgumentTypeException("targetEvent", targetEvent, FrameworkEvent);

        this[$targetEvent] = targetEvent;
        this[$actions] = new ActionCollection(this, ...actions);
    }

    private [$removeAllActions]() {
        const actionsCopy = [...this.actions];
        for (let action of actionsCopy)
            action.unsetTrigger();
    }

    private [$executeAllActions](data: Dictionary<string, any>) {
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

    private [$targetEvent_handler](sender: any, args: FrameworkEventArgs) {
        const data: Dictionary<string, any> = Dictionary.fromKeyValueObject(args);
        this[$executeAllActions](data);
    }

    get targetEvent(): FrameworkEvent { return this[$targetEvent]; }
    private [$targetEvent]: FrameworkEvent;

    get actions(): ActionCollection { return this[$actions]; }
    private [$actions]: ActionCollection;

    protected destructor() {
        this[$removeAllActions]();
    }
}