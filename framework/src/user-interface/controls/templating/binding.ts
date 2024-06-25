import { DependencyObject, DependencyProperty } from "../../../standard/dependency-objects/index.js";
import { FrameworkException } from "../../../standard/exceptions/index.js";
import { Type } from "../../../standard/reflection/index.js";
import { OrConstraint } from "../../../standard/reflection/type-constraints/index.js";
import { BindingDirection } from "../../bindings/index.js";
import { IValueConverter } from "../../value-converters/index.js";

type RelativeSourceSelector = (target: DependencyObject, templatedParent: DependencyObject) => DependencyObject;
type PropertySelector = (targetCtor: typeof DependencyObject) => DependencyProperty;

export class Binding {
    constructor(property: DependencyProperty);
    constructor(property: DependencyProperty, valueConverter: IValueConverter | null);
    constructor(property: DependencyProperty, direction: number);
    constructor(property: DependencyProperty, direction: number, valueConverter: IValueConverter | null);
    constructor(relativeSource: DependencyObject, property: DependencyProperty);
    constructor(relativeSource: DependencyObject, property: DependencyProperty, direction: number);
    constructor(relativeSource: DependencyObject, property: DependencyProperty, direction: number, valueConverter: IValueConverter | null);
    constructor(relativeSource: RelativeSourceSelector, property: PropertySelector);
    constructor(relativeSource: RelativeSourceSelector, property: PropertySelector, direction: number);
    constructor(relativeSource: RelativeSourceSelector, property: PropertySelector, direction: number, valueConverter: IValueConverter | null);
    constructor() {
        if (arguments.length == 1) {
            if (Type.of(arguments[0]).matches(Type.get(DependencyProperty))) {
                this.#property = arguments[0];
                return;
            }
        }
        else if (arguments.length == 2) {
            if (Type.of(arguments[0]).matches(Type.get(DependencyProperty)) &&
                Type.of(arguments[1]).matches(new OrConstraint([Type.of(null), IValueConverter]))) {
                this.#property = arguments[0];
                this.#valueConverter = arguments[1];
                return;
            }
            if (Type.of(arguments[0]).matches(Type.get(DependencyProperty)) &&
                Type.of(arguments[1]).matches(Type.get(Number))) {
                this.#property = arguments[0];
                this.#direction = arguments[1];
                return;
            }
            if (Type.of(arguments[0]).matches(Type.get(DependencyObject)) &&
                Type.of(arguments[1]).matches(Type.get(DependencyProperty))) {
                this.#relativeSource = arguments[0];
                this.#property = arguments[1];
                return;
            }
            if (Type.of(arguments[0]).matches(Type.get(Function)) &&
                Type.of(arguments[1]).matches(Type.get(Function))) {
                this.#relativeSource = arguments[0];
                this.#property = arguments[1];
                return;
            }
        }
        else if (arguments.length == 3) {
            if (Type.of(arguments[0]).matches(Type.get(DependencyProperty)) &&
                Type.of(arguments[1]).matches(Type.get(Number)) &&
                Type.of(arguments[2]).matches(new OrConstraint([Type.of(null), IValueConverter]))) {
                this.#relativeSource = arguments[0];
                this.#property = arguments[1];
                this.#valueConverter = arguments[2];
                return;
            }
            if (Type.of(arguments[0]).matches(Type.get(DependencyObject)) &&
                Type.of(arguments[1]).matches(Type.get(DependencyProperty)) &&
                Type.of(arguments[2]).matches(Type.get(Number))) {
                this.#relativeSource = arguments[0];
                this.#property = arguments[1];
                this.#direction = arguments[2];
                return;
            }
            if (Type.of(arguments[0]).matches(Type.get(Function)) &&
                Type.of(arguments[1]).matches(Type.get(Function)) &&
                Type.of(arguments[2]).matches(Type.get(Number))) {
                this.#relativeSource = arguments[0];
                this.#property = arguments[1];
                this.#direction = arguments[2];
                return;
            }
        }
        else if (arguments.length == 4) {
            if (Type.of(arguments[0]).matches(Type.get(DependencyObject)) &&
                Type.of(arguments[1]).matches(Type.get(DependencyProperty)) &&
                Type.of(arguments[3]).matches(Type.get(Number)) &&
                Type.of(arguments[4]).matches(new OrConstraint([Type.of(null), IValueConverter]))) {
                this.#relativeSource = arguments[0];
                this.#property = arguments[1];
                this.#direction = arguments[2];
                this.#valueConverter = arguments[3];
                return;
            }
            if (Type.of(arguments[0]).matches(Type.get(Function)) &&
                Type.of(arguments[1]).matches(Type.get(Function)) &&
                Type.of(arguments[3]).matches(Type.get(Number)) &&
                Type.of(arguments[4]).matches(new OrConstraint([Type.of(null), IValueConverter]))) {
                this.#relativeSource = arguments[0];
                this.#property = arguments[1];
                this.#direction = arguments[2];
                this.#valueConverter = arguments[3];
                return;
            }
        }
        else
            throw new FrameworkException(`No overload takes ${arguments.length} arguments.`);
        throw new FrameworkException(`No overload matches this call.`);
    }

    get relativeSource(): RelativeSourceSelector | null { return this.#relativeSource; }
    #relativeSource: RelativeSourceSelector | null = null;

    get property(): DependencyProperty { return this.#property; }
    #property: DependencyProperty;

    get direction(): number { return this.#direction; }
    #direction: number = BindingDirection.Both;

    get valueConverter(): IValueConverter | null { return this.#valueConverter; }
    #valueConverter: IValueConverter | null = null;
}
