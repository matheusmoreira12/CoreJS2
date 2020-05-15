import { Trigger } from "./index.js";
import { DependencyProperty, DependencyObject } from "../../Standard/DependencyObjects/index.js";
import { Setter } from "../Setters/index.js";
import { SetterCollection } from "../Setters/SetterCollection.js";
import { assertParams, assertEachParams, TypeValidationMode } from "../../Validation/index.js";

//Keys for PropertyTrigger

/**
 * PropertyTrigger class
 * Triggers a group of setters when the specified property matches the specified value.
 */
export class PropertyTrigger extends Trigger {
    constructor(target: DependencyObject, targetProperty: DependencyProperty, value: any, ...setters: Setter[]) {
        super();

        assertParams({ target }, [Object]);
        assertParams({ targetProperty }, [DependencyProperty]);
        assertEachParams({ setters }, [Setter], TypeValidationMode.MatchAny, [Array]);

        this.__target = target;
        this.__targetProperty = targetProperty;
        this.__value = value;
        this.__setters = new SetterCollection(this, ...setters);
    }

    get target(): object { return this.__target; }
    private __target: object;

    get targetProperty(): DependencyProperty { return this.__targetProperty; }
    private __targetProperty: DependencyProperty;

    get value(): any { return this.__value; }
    private __value: any;

    get setters(): SetterCollection { return this.__setters; }
    private __setters: SetterCollection;

    protected destructor() {
        this.setters.clear();
    }
}