import { Trigger } from "./index";
import { DependencyProperty, PropertyChangeEventArgs, DependencyObject } from "../../Standard/DependencyObjects/index";
import { ArgumentTypeException } from "../../Standard/index";
import { Setter } from "../Setters/index";
import { SetterCollection } from "../Setters/SetterCollection";

/**
 * PropertyTrigger class
 * Triggers a group of setters when the specified property matches the specified value.
 */
export class PropertyTrigger extends Trigger {
    constructor(target: DependencyObject, targetProperty: DependencyProperty, value: any, ...setters: Setter[]) {
        super();

        if (typeof target !== "object") throw new ArgumentTypeException("target", target, Object);

        if (!(targetProperty instanceof DependencyProperty)) throw new ArgumentTypeException("targetProperty",
            targetProperty, DependencyProperty);

        this.__target = target;
        this.__targetProperty = targetProperty;
        this.__value = value;
        this.__setters = new SetterCollection(this, ...setters);

        target.PropertyChangeEvent.attach(this.__target_onPropertyChange, this);
    }

    private __target_onPropertyChange(sender: any, args: PropertyChangeEventArgs) {
        if (args.target !== this.target)
            return;
        if (args.newValue !== this.value)
            return;
    }

    get target(): object { return this.__target; }
    private __target: object;

    get targetProperty(): DependencyProperty { return this.__targetProperty; }
    private __targetProperty: DependencyProperty;

    get value(): any { return this.__value; }
    private __value: any;

    get setters(): SetterCollection { return this.__setters; }
    private __setters: SetterCollection;
}