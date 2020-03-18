import { ObservableCollection, ObservableCollectionChangeArgs, ObservableCollectionChangeAction } from "../../Standard/Collections/index"
import { Setter } from "./Setter"
import { Enumeration } from "../../Standard/index"
import { PropertyTrigger } from "../Triggers/index";
import { assertParams } from "../../Validation/index";

export const $setTrigger = Symbol("setTrigger");
export const $unsetTrigger = Symbol("unsetTrigger");

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
                oldItem[$unsetTrigger]();
        if (Enumeration.contains(ObservableCollectionChangeAction.Add, args.action))
            for (let newItem of args.newItems)
                newItem[$setTrigger](this.__parentTrigger);
    }

    private __parentTrigger: PropertyTrigger;
}