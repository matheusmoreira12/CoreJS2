import { assertParams } from "../../validation/index.js";
import { InvalidOperationException } from "../exceptions/index.js";
import { ClassOf } from "../reflection/index.js";
import { DependencyPropertyKey, PropertyMetadata } from "./index.js";

import { _Registry } from "./_registry.js";

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

        const property = new DependencyProperty();
        _Registry.registerAttachedProperty(target, property, name, metadata);
        return property;
    }

    static registerReadonly(target: ClassOf<any>, name: string, metadata: PropertyMetadata): DependencyPropertyKey {
        assertParams({ target }, [Function]);
        assertParams({ options: metadata }, [PropertyMetadata]);
        assertAttachedProperty(target, name, true);

        const property = new DependencyProperty();
        const propertyKey = new DependencyPropertyKey();
        _Registry.registerReadonlyProperty(target, property, name, propertyKey, metadata);

        return propertyKey;
    }

    static register(target: ClassOf<any>, name: string, metadata: PropertyMetadata): DependencyProperty {
        assertParams({ target }, [Function]);
        assertParams({ metadata }, [PropertyMetadata]);

        const property = new DependencyProperty();
        _Registry.registerProperty(target, property, name, metadata);
        return property;
    }

    static getMetadata(property: DependencyProperty): PropertyMetadata {
        assertParams({ property }, [DependencyProperty]);

        const metadata = _Registry.getPropertyMetadata(property);
        if (metadata)
            return metadata;
        else
            throw new InvalidOperationException("Cannot get metadata. Invalid dependency property.")
    }

    static getAll(target: ClassOf<any>): IterableIterator<DependencyProperty> {
        assertParams({ target }, [Function]);

        return _Registry.getAllProperties(target);
    }

    get name(): string {
        const name = _Registry.getPropertyName(this);
        if (name)
            return name;
        else
            throw new InvalidOperationException("Cannot get name. Invalid dependency property.");
    }
}