import { assertParams } from "../../validation/index.js";
import { InvalidOperationException } from "../exceptions/index.js";
import { OutputArgument } from "../reflection/types";
import { DependencyObjectClass } from "./dependency-object-class";
import { DependencyPropertyKey, PropertyMetadata } from "./index.js";
import { __Registry } from "./__registry.js";

/**
 * Eases the integration between user-defined properties and framework features.
 */
export class DependencyProperty {
    static registerAttached(target: DependencyObjectClass, name: string, metadata: PropertyMetadata): DependencyProperty {
        assertParams({ target }, [Function]);
        assertParams({ metadata }, [PropertyMetadata]);
        assertAttachedProperty(target, name, false);

        const property = new DependencyProperty();
        if (__Registry.tryRegisterAttached(target, property, name, metadata))
            return property;
        throw new InvalidOperationException("Cannot register dependency property. Property may already be registered.");
    }

    static registerReadonly(target: DependencyObjectClass, name: string, metadata: PropertyMetadata): DependencyPropertyKey {
        assertParams({ target }, [Function]);
        assertParams({ options: metadata }, [PropertyMetadata]);
        assertAttachedProperty(target, name, true);

        const property = new DependencyProperty();
        const propertyKey = new DependencyPropertyKey();
        if (__Registry.tryRegisterReadonly(target, property, name, propertyKey, metadata))
            return propertyKey;
        throw new InvalidOperationException("Cannot register dependency property. Property may already be registered.");
    }

    static register(target: DependencyObjectClass, name: string, metadata: PropertyMetadata): DependencyProperty {
        assertParams({ target }, [Function]);
        assertParams({ metadata }, [PropertyMetadata]);

        const property = new DependencyProperty();
        if (__Registry.tryRegister(target, property, name, metadata))
            return property;
        throw new InvalidOperationException("Cannot register dependency property. Property may already be registered.");
    }

    static getMetadata(property: DependencyProperty): PropertyMetadata {
        assertParams({ property }, [DependencyProperty]);

        const tryGetPropertyMetadataOutput: OutputArgument<PropertyMetadata> = {};
        if (__Registry.tryGetMetadata(property, tryGetPropertyMetadataOutput))
            return tryGetPropertyMetadataOutput.value!;
        throw new InvalidOperationException("Cannot get metadata. Invalid dependency property.");
    }

    static getAll(target: DependencyObjectClass): IterableIterator<DependencyProperty> {
        assertParams({ target }, [Function]);

        return __Registry.getAll(target);
    }

    get name(): string {
        const tryGetPropertyNameOutput: OutputArgument<string> = {};
        if (__Registry.tryGetName(this, tryGetPropertyNameOutput))
            return tryGetPropertyNameOutput.value!;
        throw new InvalidOperationException("Cannot get name. Invalid dependency property.");
    }
}

function assertAttachedProperty(target: DependencyObjectClass, name: string, isReadonly: boolean) {
    const descriptor = Object.getOwnPropertyDescriptor(target.prototype, name);
    if (!descriptor)
        throw new InvalidOperationException(`Cannot register dependency property. Missing property ${name} in ${target.name}.`)
    else if (!descriptor.get)
        throw new InvalidOperationException(`Cannot register dependency property. Missing getter for property ${name} in class ${target.name}.`);
    else if (!descriptor.set && !isReadonly)
        throw new InvalidOperationException(`Cannot register dependency property. Missing setter for property ${name} in class ${target.name}.`);
}