import { FrameworkEvent, FrameworkEventArgs } from "../../Standard/Events/index.js";
import { Trigger } from "./index.js";
import { Dictionary, Collection } from "../../Standard/Collections/index.js";
import { Action } from "../Actions/index.js";
import { assertParams, assertEachParams, TypeValidationMode } from "../../Validation/index.js";
import { DependencyProperty } from "../../Standard/DependencyObjects/index.js";
import { Type } from "../../Standard/Types/index.js";

/**
 * EventTrigger class
 * Triggers a group of actions upon the firing of an event.
 */
export class EventTrigger extends Trigger {
    constructor(targetEvent: FrameworkEvent, ...actions: Action[]) {
        super();

        assertParams({ targetEvent }, [FrameworkEvent]);
        assertEachParams({ actions }, [Action], TypeValidationMode.MatchAny, [Array]);

        targetEvent.attach(this.__targetEvent_handler);

        this.set(EventTrigger.targetEventProperty, targetEvent);
        this.set(EventTrigger.actionsProperty, new Collection(...actions));
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

    static targetEventProperty = DependencyProperty.registerReadonly(EventTrigger, "targetEvent", { valueType: Type.get(FrameworkEvent) })
    get targetEvent(): FrameworkEvent { return this.get(EventTrigger.targetEventProperty); }

    static actionsProperty = DependencyProperty.registerReadonly(EventTrigger, "actions", { valueType: Type.get(Collection) })
    get actions(): Collection<Action> { return this.get(EventTrigger.actionsProperty); }

    protected destructor() {
        this.actions.clear();
    }
}