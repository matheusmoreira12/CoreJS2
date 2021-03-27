import { Trigger } from "./index.js";
import { DependencyProperty, DependencyObject } from "../../standard/dependency-objects/index.js";
import { Setter } from "../setters/index.js";
import { assertParams, assertEachParams, TypeValidationMode } from "../../validation/index.js";
import { Type } from "../../standard/reflection/type.js";
import { Collection } from "../../standard/collections/index.js";

/**
 * PropertyTrigger class
 * Triggers a group of setters when the specified property matches the specified value.
 */
export class PropertyTrigger extends Trigger {
    constructor(target: DependencyObject, property: DependencyProperty, value: any, ...setters: Setter[]) {
        super();

        assertParams({ target }, [Object]);
        assertParams({ property }, [DependencyProperty]);
        assertEachParams({ setters }, [Setter], TypeValidationMode.MatchAny, [Array]);

        this.set(PropertyTrigger.targetProperty, target);
        this.set(PropertyTrigger.propertyProperty, property);
        this.set(PropertyTrigger.valueProperty, value);
        this.set(PropertyTrigger.settersProperty, new Collection(...setters));
    }

    static targetProperty = DependencyProperty.registerReadonly(PropertyTrigger, "target", { valueType: Type.get(DependencyObject) });
    get target(): object { return this.get(PropertyTrigger.targetProperty); }

    static propertyProperty = DependencyProperty.registerReadonly(PropertyTrigger, "property", { valueType: Type.get(DependencyProperty) });
    get property(): DependencyProperty { return this.get(PropertyTrigger.propertyProperty); }

    static valueProperty = DependencyProperty.registerReadonly(PropertyTrigger, "value");
    get value(): any { return this.get(PropertyTrigger.valueProperty); }

    static settersProperty = DependencyProperty.registerReadonly(PropertyTrigger, "setters", { valueType: Type.get(Collection) });
    get setters(): Collection<Setter> { return this.get(PropertyTrigger.settersProperty); }

    protected destructor() {
        this.setters.clear();
    }
}