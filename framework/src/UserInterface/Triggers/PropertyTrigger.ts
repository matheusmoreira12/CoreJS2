import { Trigger } from "./index.js";
import { DependencyProperty, DependencyObject } from "../DependencyObjects/index.js";
import { Setter } from "../Setters/index.js";
import { SetterCollection } from "../Setters/SetterCollection.js";
import { assertParams, assertEachParams, TypeValidationMode } from "../../Validation/index.js";

//Keys for PropertyTrigger
const $target = Symbol("target");
const $targetProperty = Symbol("targetProperty");
const $value = Symbol("value");
const $setters = Symbol("setters");

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

    protected destructor() {
        this.setters.clear();
    }
}