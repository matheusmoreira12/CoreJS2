import { DependencyProperty, PropertyMetadata } from "../../standard/dependency-objects/index.js"
import { assertParams } from "../../validation/index.js";
import { DependencyObject } from "../../standard/dependency-objects/dependency-object.js";
import { Type } from "../../standard/reflection/index.js";

/**
 * Sets the value of the specified property on the specified target to the specified value whenever the trigger's condition is met.
 */
export class Setter extends DependencyObject {
    constructor(target: DependencyObject, property: DependencyProperty, value: any) {
        super();

        assertParams({ target }, [DependencyObject]);
        assertParams({ property }, [DependencyProperty]);

        this.set(Setter.targetProperty, target);
        this.set(Setter.propertyProperty, property);
        this.set(Setter.valueProperty, value);
    }

    static targetProperty = DependencyProperty.registerAttachedReadonly(Setter, "target", new PropertyMetadata(Type.get(DependencyObject)));
    get target(): DependencyObject { return this.get(Setter.targetProperty); }

    static propertyProperty = DependencyProperty.registerAttachedReadonly(Setter, "property", new PropertyMetadata(Type.get(DependencyProperty)));
    get property(): DependencyProperty { return this.get(Setter.propertyProperty); }

    static valueProperty = DependencyProperty.registerAttachedReadonly(Setter, "value", new PropertyMetadata(null));
    get value(): any { return this.get(Setter.valueProperty); }
}