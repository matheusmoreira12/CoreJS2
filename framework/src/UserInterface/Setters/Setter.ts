import { DependencyProperty, DependencyObject } from "../../Standard/DependencyObjects/index"
import { assertParameter } from "../../Validation/index";

const $property = Symbol();
const $value = Symbol();
const $target = Symbol();

/**
 * 
 */
export class Setter {
    constructor(target: DependencyObject, property: DependencyProperty, value: any) {
        assertParameter("property", property, <any>DependencyProperty);

        this[$target] = target;
        this[$property] = property;
        this[$value] = value;
    }

    get property(): DependencyProperty { return this[$property]; }
    private [$property]: DependencyProperty;

    get value(): any { return this[$value]; }
    private [$value]: any;

    get target(): DependencyObject { return this[$target]; }
    private [$target]: DependencyObject;
}