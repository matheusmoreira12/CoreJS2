import { BindingDirection } from "./index.js";
import { InvalidOperationException } from "../../standard/exceptions/index.js"
import { assertParams } from "../../validation/index.js";
import { DependencyProperty, DependencyPropertyKey, PropertyMetadata } from "../../standard/dependency-objects/index.js";
import { IValueConverter } from "../value-converters/index.js";
import { OrConstraint } from "../../standard/reflection/type-constraints/index.js";
import { Type } from "../../standard/reflection/index.js";
import { Destructible } from "../../standard/index.js";

/**
 * Binding base class
 */
export abstract class Binding extends Destructible {
    constructor(direction: number = BindingDirection.Both, valueConverter: IValueConverter | null = null) {
        if (new.target === Binding)
            throw new InvalidOperationException("Invalid constructor.");

        super();

        BindingDirection.assertFlag(BindingDirection.Both);
        assertParams({ valueConverter }, [IValueConverter, undefined]);

        this.__direction = direction;
        this.__valueConverter = valueConverter;
    }

    get direction(): number { return this.__direction; }
    private __direction: number;

    get valueConverter(): IValueConverter | null { return this.__valueConverter; }
    private __valueConverter: IValueConverter | null;
}