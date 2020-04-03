import { ObservableCollection, ObservableCollectionChangeArgs, ObservableCollectionChangeAction } from "../../Standard/Collections/index.js"
import { Setter, $setTrigger } from "./Setter.js"
import { Enumeration } from "../../Standard/index.js"
import { PropertyTrigger } from "../Triggers/index.js";
import { assertParams } from "../../Validation/index.js";

export class SetterCollection extends ObservableCollection<Setter> {
    constructor(parentTrigger: PropertyTrigger, ...items: Setter[]) {
        assertParams({ parentTrigger }, [PropertyTrigger]);

        super(...items);

        this.__parentTrigger = parentTrigger;

        this.__ChangeEvent.attach(this.__onChange, this);
    }

    private __onChange(sender: any, args: ObservableCollectionChangeArgs<Setter>) {
        if (Enumeration.contains(ObservableCollectionChangeAction.Remove, args.action))
            for (let oldItem of args.oldItems)
                oldItem[$setTrigger](null);
        if (Enumeration.contains(ObservableCollectionChangeAction.Add, args.action))
            for (let newItem of args.newItems)
                newItem[$setTrigger](this.__parentTrigger);
    }

    private __parentTrigger: PropertyTrigger;
}