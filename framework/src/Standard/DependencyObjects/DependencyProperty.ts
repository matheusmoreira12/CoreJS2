import { PropertyMetadata } from "./PropertyMetadata";
import * as Registry from "./Registry";
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

    static overrideContext(target: DependencyObject) {
        Registry.overrideContext(target);
    }

    constructor(name: string) {
        this.__name = name;
    }

    get name(): string { return this.__name; }
    private __name: string
}