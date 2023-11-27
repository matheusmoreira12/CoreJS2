import { DependencyObject, DependencyProperty } from "../../../standard/dependency-objects/index.js";
import { FrameworkException } from "../../../standard/exceptions/index.js";
import { Type } from "../../../standard/reflection/index.js";
import { BindingDirection } from "../../bindings/index.js";

type RelativeSourceSelector = (templatedParent: DependencyObject, context: object) => DependencyObject;
type DependencyPropertySelector = (source: DependencyObject) => DependencyProperty;

export class Binding {
    constructor(property: DependencyPropertySelector);
    constructor(property: DependencyPropertySelector, direction: number);
    constructor(relativeSource: RelativeSourceSelector, property: DependencyPropertySelector);
    constructor(relativeSource: RelativeSourceSelector, property: DependencyPropertySelector, direction: number);
    constructor() {
        if (arguments.length == 1) {
            if (Type.of(arguments[0]).matches(Type.get(Function))) {
                this.#property = arguments[0];

                return;
            }
        }
        else if (arguments.length == 2) {
            if (Type.of(arguments[0]).matches(Type.get(Function)) &&
                Type.of(arguments[1]).matches(Type.get(Number))) {
                this.#property = arguments[0];
                this.#direction = arguments[1];

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
            if (Type.of(arguments[0]).matches(Type.get(Function)) &&
                Type.of(arguments[1]).matches(Type.get(Function)) &&
                Type.of(arguments[2]).matches(Type.get(Number))) {
                this.#relativeSource = arguments[0];
                this.#property = arguments[1];
                this.#direction = arguments[1];

                return;
            }
        }
        else
            throw new FrameworkException(`No overload takes ${arguments.length} arguments.`);
        throw new FrameworkException(`No overload matches this call.`);
    }

    get relativeSource(): RelativeSourceSelector | null { return this.#relativeSource; }
    #relativeSource: RelativeSourceSelector | null = null;

    get property(): DependencyPropertySelector { return this.#property; }
    #property: DependencyPropertySelector;

    get direction(): number { return this.#direction; }
    #direction: number = BindingDirection.Both;
}
