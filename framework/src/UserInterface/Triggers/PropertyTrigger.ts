import { Trigger } from "./index";
import { FrameworkProperty, PropertyChangeEventArgs } from "../DependencyObjects/index";
import { ArgumentTypeException } from "../../Standard/index";
import { Collection } from "../../Standard/Collections/index";
import { Setter } from "../Setters/index";

/**
 * PropertyTrigger class
 * Triggers a group of setters when the specified property matches the specified value.
 */
export class PropertyTrigger extends Trigger {
    constructor(target: object, targetProperty: FrameworkProperty, value: any, ...setters: Setter[]) {
        super();

        if (typeof target !== "object") throw new ArgumentTypeException("target", target, Object);

        if (!(targetProperty instanceof FrameworkProperty)) throw new ArgumentTypeException("targetProperty",
            targetProperty, FrameworkProperty);

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

    get targetProperty(): FrameworkProperty { return this.__targetProperty; }
    private __targetProperty: FrameworkProperty;

    get value(): any { return this.__value; }
    private __value: any;

    get setters(): Collection<Setter> { return this.__setters; }
    private __setters: Collection<Setter>;
}