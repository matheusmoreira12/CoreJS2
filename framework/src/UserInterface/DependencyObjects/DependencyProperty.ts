import { PropertyMetadata } from "./PropertyMetadata";
import { DependencyObject } from "./DependencyObject";

const $unsetValue = Symbol("unset");

//Keys for DependencyProperty
const $id = Symbol();

/**
 * Eases the integration between user-defined properties and framework features.
 */
export class DependencyProperty {
    static get unsetValue(): symbol { return $unsetValue; }

    static register(target: typeof DependencyObject, name: string, metadata: PropertyMetadata): DependencyProperty {
        return new DependencyProperty(0);
    }

    static overrideContext(target: DependencyObject) {

    }

    constructor(id: number) {
        this[$id] = id;
    }

    get id(): number { return this[$id]; }
    private [$id]: number;
}