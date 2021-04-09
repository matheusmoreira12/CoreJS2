import { Trigger } from "./index.js";
import { DependencyProperty, DependencyObject, PropertyMetadata } from "../../standard/dependency-objects/index.js";
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

    static targetProperty = DependencyProperty.registerAttachedReadonly(PropertyTrigger, "target", new PropertyMetadata(Type.get(DependencyObject)));
    get target(): object { return this.get(PropertyTrigger.targetProperty); }

    static propertyProperty = DependencyProperty.registerAttachedReadonly(PropertyTrigger, "property", new PropertyMetadata(Type.get(DependencyProperty)));
    get property(): DependencyProperty { return this.get(PropertyTrigger.propertyProperty); }

    static valueProperty = DependencyProperty.registerAttachedReadonly(PropertyTrigger, "value", new PropertyMetadata(null));
    get value(): any { return this.get(PropertyTrigger.valueProperty); }

    static settersProperty = DependencyProperty.registerAttachedReadonly(PropertyTrigger, "setters", new PropertyMetadata(Type.get(Collection)));
    get setters(): Collection<Setter> { return this.get(PropertyTrigger.settersProperty); }

    protected destructor() {
        this.setters.clear();
    }
}