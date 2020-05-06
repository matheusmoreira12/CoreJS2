import { ObservableCollection, ObservableCollectionChangeArgs, ObservableCollectionChangeAction } from "../../Standard/Collections/index.js";
import { Action } from "./Action.js";
import { EventTrigger } from "../Triggers/index.js";
import { assertParams } from "../../Validation/index.js";
import { Enumeration } from "../../Standard/index.js";

export class ActionCollection extends ObservableCollection<Action> {
    constructor(parentTrigger: EventTrigger, ...items: Action[]) {
        assertParams({ parentTrigger }, [EventTrigger]);

        super(...items);

        this.__parentTrigger = parentTrigger;

        this.__ChangeEvent.attach(this.__onChange, this);
    }

    private __onChange(sender: any, args: ObservableCollectionChangeArgs<Action>) {
        if (Enumeration.contains(ObservableCollectionChangeAction.Remove, args.action))
            for (let oldItem of args.oldItems)
                oldItem.__setTrigger(null);
        if (Enumeration.contains(ObservableCollectionChangeAction.Add, args.action))
            for (let newItem of args.newItems)
                newItem.__setTrigger(this.__parentTrigger);
    }

    private __parentTrigger: EventTrigger;
}