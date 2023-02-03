import { FrameworkEvent, FrameworkEventArgs } from "../../standard/events/index.js";
import { Trigger } from "./index.js";
import { Dictionary, Collection } from "../../standard/collections/index.js";
import { Action } from "../actions/index.js";
import { assertParams, assertEachParams, TypeValidationMode } from "../../validation/index.js";
import { DependencyProperty, DependencyPropertyKey, PropertyMetadata } from "../../standard/dependency-objects/index.js";
import { Type } from "../../standard/reflection/index.js";

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

        this.set(EventTrigger.__targetEventPropertyKey, targetEvent);
        this.set(EventTrigger.__actionsPropertyKey, new Collection(...actions));
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

    static __targetEventPropertyKey: DependencyPropertyKey = DependencyProperty.registerReadonly(Type.get(EventTrigger), "targetEvent", new PropertyMetadata(Type.get(FrameworkEvent)))
    static targetEventProperty: DependencyProperty = EventTrigger.__targetEventPropertyKey.property;
    get targetEvent(): FrameworkEvent { return this.get(EventTrigger.targetEventProperty); }

    static __actionsPropertyKey: DependencyPropertyKey = DependencyProperty.registerReadonly(Type.get(EventTrigger), "actions", new PropertyMetadata(Type.get(Collection)))
    static actionsProperty: DependencyProperty = EventTrigger.__actionsPropertyKey.property;
    get actions(): Collection<Action> { return this.get(EventTrigger.actionsProperty); }

    protected override _destructor() {
        this.actions.clear();
    }
}