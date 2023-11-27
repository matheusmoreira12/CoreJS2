import { DependencyObject, DependencyProperty } from "../../../standard/dependency-objects/index.js";
import { assertParams } from "../../../validation/index.js";

type DependencyPropertySelector = (templatedParent: DependencyObject) => DependencyProperty;

export class TemplateBinding {
    constructor(property: DependencyPropertySelector) {
        assertParams({ property }, [Function]);

        this.#property = property;
    }

    get property(): DependencyPropertySelector { return this.#property; }
    #property: DependencyPropertySelector;
}