import { DependencyProperty } from "../../../standard/dependency-objects/index.js";
import { assertParams } from "../../../validation/index.js";

export class TemplateBinding {
    constructor(property: DependencyProperty) {
        assertParams({ property }, [DependencyProperty]);

        this.#property = property;
    }

    get property(): DependencyProperty { return this.#property; }
    #property: DependencyProperty;
}