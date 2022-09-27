import { assertParams } from "../../validation/index.js";
import { InvalidOperationException } from "../exceptions/index.js";
import { Guid } from "../guids/index.js";
import { OutputArgument } from "../reflection/types";
import { DependencyObjectClass } from "./dependency-object-class";
import { DependencyPropertyKey, PropertyMetadata } from "./index.js";
import { __Registry } from "./__registry.js";
import { __Validation } from "./__validation.js";

/**
 * Eases the integration between user-defined properties and framework features.
 */
export class DependencyProperty {
    static registerAttached(target: DependencyObjectClass, name: string, metadata: PropertyMetadata): DependencyProperty {
        assertParams({ target }, [Function]);
        assertParams({ metadata }, [PropertyMetadata]);
        __Validation.assertAttachedProperty(target, name, false);

        const property = new DependencyProperty();
        if (__Registry.tryRegisterAttached(target, property, name, metadata))
            return property;
        throw new InvalidOperationException("Cannot register dependency property. Property may already be registered.");
    }

    static registerReadonly(target: DependencyObjectClass, name: string, metadata: PropertyMetadata): DependencyPropertyKey {
        assertParams({ target }, [Function]);
        assertParams({ options: metadata }, [PropertyMetadata]);
        __Validation.assertAttachedProperty(target, name, true);

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

    get name(): string {
        const tryGetPropertyNameOutput: OutputArgument<string> = {};
        if (__Registry.tryGetName(this, tryGetPropertyNameOutput))
            return tryGetPropertyNameOutput.value!;
        throw new InvalidOperationException("Cannot get name. Invalid dependency property.");
    }

    get id() { return this.__id ?? (() => { throw new InvalidOperationException("Cannot get id. Invalid dependency property key.") })() }
    __id: Guid | null = null;
}