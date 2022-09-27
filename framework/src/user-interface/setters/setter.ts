import { DependencyProperty, DependencyPropertyKey, PropertyMetadata } from "../../standard/dependency-objects/index.js"
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

        this.set(Setter.__targetPropertyKey, target);
        this.set(Setter.__propertyPropertyKey, property);
        this.set(Setter.__valuePropertyKey, value);
    }

    static __targetPropertyKey: DependencyPropertyKey = DependencyProperty.registerReadonly(Type.get(Setter), "target", new PropertyMetadata(Type.get(DependencyObject)));
    static targetProperty: DependencyProperty = Setter.__targetPropertyKey.property;
    get target(): DependencyObject { return this.get(Setter.targetProperty); }

    static __propertyPropertyKey = DependencyProperty.registerReadonly(Type.get(Setter), "property", new PropertyMetadata(Type.get(DependencyProperty)));
    static propertyProperty = Setter.__propertyPropertyKey.property;
    get property(): DependencyProperty { return this.get(Setter.propertyProperty); }

    static __valuePropertyKey = DependencyProperty.registerReadonly(Type.get(Setter), "value", new PropertyMetadata(null));
    static valueProperty = Setter.__valuePropertyKey.property;
    get value(): any { return this.get(Setter.valueProperty); }
}