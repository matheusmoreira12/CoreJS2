import { BindingDirection } from "./index.js";
import { InvalidOperationException } from "../../standard/exceptions/index.js"
import { assertParams } from "../../validation/index.js";
import { DependencyObject, DependencyProperty, DependencyPropertyKey, PropertyMetadata } from "../../standard/dependency-objects/index.js";
import { IValueConverter } from "../value-converters/index.js";
import { OrConstraint } from "../../standard/reflection/type-constraints/index.js";
import { Type } from "../../standard/reflection/index.js";

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

        this.set(Binding.__directionPropertyKey, direction);
        this.set(Binding.__valueConverterPropertyKey, valueConverter);
    }

    static __directionPropertyKey: DependencyPropertyKey = DependencyProperty.registerReadonly(Binding, "direction", new PropertyMetadata(Type.get(Number)));
    static directionProperty: DependencyProperty = Binding.__directionPropertyKey.property;
    get direction(): number { return this.get(Binding.directionProperty); }

    static __valueConverterPropertyKey: DependencyPropertyKey = DependencyProperty.registerReadonly(Binding, "valueConverter", new PropertyMetadata(new OrConstraint([IValueConverter, Type.of(null)])));
    static valueConverterProperty = Binding.__valueConverterPropertyKey.property;
    get valueConverter(): IValueConverter | null { return this.get(Binding.valueConverterProperty); }
}