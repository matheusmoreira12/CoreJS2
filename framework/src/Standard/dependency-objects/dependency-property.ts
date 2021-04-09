import { assertParams } from "../../validation/index.js";

import * as Registry from "./_registry.js";
import { ClassOf } from "../reflection/types.js";
import { InvalidOperationException } from "../exceptions/index.js";
import { PropertyMetadata } from "./index.js";

function assertAttachedProperty(target: ClassOf<any>, name: string, isReadonly: boolean) {
    const descriptor = Object.getOwnPropertyDescriptor(target.prototype, name);
    if (!descriptor)
        throw new InvalidOperationException(`Cannot register dependency property. Missing property ${name} in ${target.name}.`)
    else if (!descriptor.get)
        throw new InvalidOperationException(`Cannot register dependency property. Missing getter for property ${name} in class ${target.name}.`);
    else if (!descriptor.set && !isReadonly)
        throw new InvalidOperationException(`Cannot register dependency property. Missing setter for property ${name} in class ${target.name}.`);
}

/**
 * Eases the integration between user-defined properties and framework features.
 */
export class DependencyProperty {
    static registerAttached(target: ClassOf<any>, name: string, metadata: PropertyMetadata): DependencyProperty {
        assertParams({ target }, [Function]);
        assertParams({ metadata }, [PropertyMetadata]);

        assertAttachedProperty(target, name, false);

        const property = new DependencyProperty(name);
        Registry.registerAttached(target, property, metadata);
        return property;
    }

    static registerAttachedReadonly(target: ClassOf<any>, name: string, metadata: PropertyMetadata): DependencyProperty {
        assertParams({ target }, [Function]);
        assertParams({ options: metadata }, [PropertyMetadata]);
        assertAttachedProperty(target, name, true);

        const property = new DependencyProperty(name);
        Registry.registerReadonly(target, property, metadata);
        return property;
    }

    static register(target: ClassOf<any>, name: string, metadata: PropertyMetadata): DependencyProperty {
        assertParams({ target }, [Function]);
        assertParams({ options: metadata }, [PropertyMetadata]);

        const property = new DependencyProperty(name);
        Registry.register(target, property, metadata);
        return property;
    }

    static getMetadata(property: DependencyProperty): PropertyMetadata {
        const options = Registry.getMetadata(property);
        if (options)
            return options;
        else
            throw new InvalidOperationException("Cannot get options. The specified property has not been registered.")
    }

    static getAll(target: ClassOf<any>): IterableIterator<DependencyProperty> {
        return Registry.getAll(target);
    }

    constructor(name: string) {
        assertParams({ name }, [String]);

        this.__name = name;
    }

    get name(): string { return this.__name; }
    private __name: string;
}