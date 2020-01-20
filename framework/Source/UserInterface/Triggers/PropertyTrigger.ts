import { Trigger } from "./index.js";
import { DependencyProperty, PropertyChangeEventArgs } from "../DependencyObjects/index.js";
import { ArgumentTypeException } from "../../Standard/index.js";
import { Collection } from "../../Standard/Collections/index.js";
import { Setter } from "../Setters/index.js";

/**
 * PropertyTrigger class
 * Triggers a group of setters when the specified property matches the specified value.
 */
export class PropertyTrigger extends Trigger {
    constructor(target: object, targetProperty: DependencyProperty, value: any, ...setters: Setter[]) {
        super();

        if (typeof target !== "object") throw new ArgumentTypeException("target", target, Object);

        if (!(targetProperty instanceof DependencyProperty)) throw new ArgumentTypeException("targetProperty",
            targetProperty, DependencyProperty);

        this.__target = target;
        this.__targetProperty = targetProperty;
        this.__value = value;
        this.__setters = new Collection(...setters);

        targetProperty.ChangeEvent.attach(this.__targetProperty_onChange, this);
    }

    private __targetProperty_onChange(sender: any, args: PropertyChangeEventArgs) {
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

    get setters(): Collection<Setter> { return this.__setters; }
    private __setters: Collection<Setter>;
}