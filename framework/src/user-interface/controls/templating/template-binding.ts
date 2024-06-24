import { DependencyProperty } from "../../../standard/dependency-objects/index.js";
import { FrameworkException } from "../../../standard/exceptions/index.js";
import { Type } from "../../../standard/reflection/index.js";
import { IValueConverter } from "../../value-converters/index.js";

export class TemplateBinding {
    constructor(property: DependencyProperty);
    constructor(property: DependencyProperty, valueConverter: IValueConverter);
    constructor() {
        if (arguments.length == 1) {
            if (Type.of(arguments[0]).matches(Type.get(DependencyProperty))) {
                this.#property = arguments[0];
                return;
            }
        }
        else if (arguments.length == 2) {
            if (Type.of(arguments[0]).matches(Type.get(DependencyProperty)) &&
                Type.of(arguments[1]).matches(IValueConverter)) {
                this.#property = arguments[0];
                this.#valueConverter = arguments[1];
                return;
            }
        }
        else
            throw new FrameworkException(`No overload takes ${arguments.length} arguments.`);
        throw new FrameworkException(`No overload matches this call.`);
    }

    get property(): DependencyProperty { return this.#property; }
    #property: DependencyProperty;

    get valueConverter(): IValueConverter | null { return this.#valueConverter; }
    #valueConverter: IValueConverter | null = null;
}