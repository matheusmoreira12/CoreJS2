import { Trigger } from "./index";
import { DependencyProperty, PropertyChangeEventArgs, DependencyObject } from "../DependencyObjects/index";
import { ArgumentTypeException } from "../../Standard/index";
import { Setter } from "../Setters/index";
import { SetterCollection } from "../Setters/SetterCollection";

//Keys for PropertyTrigger
const $target = Symbol();
const $targetProperty = Symbol();
const $value = Symbol();
const $setters = Symbol();
const $removeAllSetters = Symbol();

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

        this[$target] = target;
        this[$targetProperty] = targetProperty;
        this[$value] = value;
        this[$setters] = new SetterCollection(this, ...setters);
    }

    get target(): object { return this[$target]; }
    private [$target]: object;

    get targetProperty(): DependencyProperty { return this[$targetProperty]; }
    private [$targetProperty]: DependencyProperty;

    get value(): any { return this[$value]; }
    private [$value]: any;

    get setters(): SetterCollection { return this[$setters]; }
    private [$setters]: SetterCollection;

    private [$removeAllSetters]() {
        const settersCopy = [...this.setters];
        for (let setter of settersCopy)
            setter.unsetTrigger();
    }

    protected destructor() {
        this[$removeAllSetters]();
    }
}