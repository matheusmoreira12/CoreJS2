import { PropertyMetadata } from "./PropertyMetadata";
import * as Registry from "./Registry";
import { DependencyObject } from "./DependencyObject";

type Class<T> = new () => T;

const $unsetValue = Symbol("unsetValue")

const $id = Symbol();

/**
 * Eases the integration between user-defined properties and framework features.
 */
export class DependencyProperty {
    get unsetValue(): symbol { return $unsetValue; }

    static register(target: Class<DependencyObject>, name: string, metadata: PropertyMetadata) {
        const property = new DependencyProperty();
        return property;
    }

    constructor(id: number) {
        this[$id] = id;
    }

    get id(): number { return this[$id]; }
    private [$id]: number;
}