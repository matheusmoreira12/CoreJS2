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

    static __targetPropertyKey = DependencyProperty.registerReadonly(PropertyTrigger, "target", new PropertyMetadata(Type.get(DependencyObject)));
    static targetProperty = PropertyTrigger.__targetPropertyKey.property;
    get target(): object { return this.get(PropertyTrigger.targetProperty); }

    static __propertyPropertyKey = DependencyProperty.registerReadonly(PropertyTrigger, "property", new PropertyMetadata(Type.get(DependencyProperty)));
    static propertyProperty = PropertyTrigger.__propertyPropertyKey.property;
    get property(): DependencyProperty { return this.get(PropertyTrigger.propertyProperty); }

    static __valuePropertyKey = DependencyProperty.registerReadonly(PropertyTrigger, "value", new PropertyMetadata(null));
    static valueProperty = PropertyTrigger.__valuePropertyKey.property;
    get value(): any { return this.get(PropertyTrigger.valueProperty); }

    static __settersPropertyKey = DependencyProperty.registerReadonly(PropertyTrigger, "setters", new PropertyMetadata(Type.get(Collection)));
    static settersProperty = PropertyTrigger.__settersPropertyKey.property;
    get setters(): Collection<Setter> { return this.get(PropertyTrigger.settersProperty); }

    protected destructor() {
        this.setters.clear();

        super.destruct();
    }
}