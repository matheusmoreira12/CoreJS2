import { Trigger } from "./index";
import { DependencyProperty, IDependencyObject } from "../DependencyObjects/index";
import { Setter } from "../Setters/index";
import { SetterCollection } from "../Setters/SetterCollection";
import { assertParams, assertEachParams } from "../../Validation/index";

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
    constructor(target: IDependencyObject, targetProperty: DependencyProperty, value: any, ...setters: Setter[]) {
        super();

        assertParams({ target }, Object);
        assertParams({ targetProperty }, DependencyProperty);
        assertEachParams({ setters }, Array, Setter);

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