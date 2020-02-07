import { PropertyMetadata } from "./PropertyMetadata";
import * as Registry from "./DependencyPropertyRegistry";
import { DependencyObject } from "./DependencyObject";

type Class<T> = new() => T;

/**
 * Eases the integration between user-defined properties and framework features.
 */
export class DependencyProperty {
    static register(target: Class<DependencyObject>, name: string, metadata: PropertyMetadata) {
        const property = new DependencyProperty(name);
        Registry.register(target, property, metadata);
        return property;
    }

    static override(target: DependencyObject) {
        Registry.override(target);
    }

    constructor(name: string) {
        this.__name = name;
    }

    get name(): string { return this.__name; }
    private __name: string;

    private __storedValues = new WeakMap<object, any>();
}