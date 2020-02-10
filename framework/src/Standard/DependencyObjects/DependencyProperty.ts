import { PropertyMetadata } from "./PropertyMetadata";
import * as Registry from "./Registry";
import { DependencyObject } from "./DependencyObject";

type Class<T> = new () => T;

const $id = Symbol();

/**
 * Eases the integration between user-defined properties and framework features.
 */
export class DependencyProperty {
    static register(target: Class<DependencyObject>, name: string, metadata: PropertyMetadata) {
        const property = new DependencyProperty(name);
        Registry.register(target, property, metadata);
        return property;
    }

    constructor(id: number) {
        this[$id] = id;
    }

    get id(): number { return this[$id]; }
    private [$id]: number;
}