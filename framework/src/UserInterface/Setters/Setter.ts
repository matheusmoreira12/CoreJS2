import { DependencyProperty, DependencyObject } from "../../Standard/DependencyObjects/index"
import { assertParams } from "../../Validation/index";
import { PropertyTrigger } from "../Triggers/index";
import { Interface } from "../../Standard/Interfaces/index";

const $property = Symbol();
const $value = Symbol();
const $target = Symbol();
const $trigger = Symbol();

/**
 * 
 */
export class Setter {
    constructor(target: DependencyObject, property: DependencyProperty, value: any) {
        assertParams(target, Interface.extract(DependencyObject));
        assertParams({ property }, <any>DependencyProperty);

        this[$target] = target;
        this[$property] = property;
        this[$value] = value;
        this[$trigger] = null;
    }

    get target(): DependencyObject { return this[$target]; }
    private [$target]: DependencyObject;

    get property(): DependencyProperty { return this[$property]; }
    private [$property]: DependencyProperty;

    get value(): any { return this[$value]; }
    private [$value]: any;

    setTrigger(trigger: PropertyTrigger) {
        assertParams({ trigger }, PropertyTrigger);

        this[$trigger] = trigger;
    }

    unsetTrigger() {
        this[$trigger] = null;
    }

    get trigger(): PropertyTrigger | null { return this[$trigger]; }
    private [$trigger]: PropertyTrigger | null;
}