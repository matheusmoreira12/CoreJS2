import { BindingDirection } from "./index.js";
import { InvalidOperationException } from "../../standard/exceptions/index.js"
import { assertParams } from "../../validation/index.js";
import { DependencyObject, DependencyProperty, PropertyMetadata } from "../../standard/dependency-objects/index.js";
import { IValueConverter } from "../value-converters/i-value-converter.js";
import { Type } from "../../standard/reflection/type.js";
import { OrConstraint } from "../../standard/reflection/type-constraints/or-constraint.js";

/**
 * Binding base class
 */
export abstract class Binding extends DependencyObject {
    constructor(direction: number = BindingDirection.Both, valueConverter: IValueConverter | undefined) {
        if (new.target === Binding)
            throw new InvalidOperationException("Invalid constructor.");

        super();

        BindingDirection.assertFlag(BindingDirection.Both);
        assertParams({ valueConverter }, [IValueConverter, undefined]);

        this.set(Binding.directionProperty, direction);
        this.set(Binding.valueConverterProperty, valueConverter);
    }

    static directionProperty = DependencyProperty.registerAttachedReadonly(Binding, "direction", new PropertyMetadata(Type.get(Number)));
    get direction(): number { return this.get(Binding.directionProperty); }

    static valueConverterProperty = DependencyProperty.registerAttachedReadonly(Binding, "valueConverter", new PropertyMetadata(new OrConstraint([IValueConverter, Type.of(null)])));
    get valueConverter(): IValueConverter | null { return this.get(Binding.valueConverterProperty); }
}