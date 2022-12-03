import { assertParams } from "../../validation/index.js";
import { InvalidOperationException } from "../exceptions/index.js";
import { Guid } from "../guids/index.js";
import { Type } from "../reflection/index.js";
import { OutputArgument } from "../reflection/types";
import { DependencyPropertyKey, PropertyMetadata } from "./index.js";
import { __Registry } from "./__registry.js";
import { __Validation } from "./__validation.js";

/**
 * Eases the integration between user-defined properties and framework features.
 */
export class DependencyProperty {
    static registerAttached(target: Type, name: string, metadata: PropertyMetadata): DependencyProperty {
        assertParams({ target }, [Type]);
        assertParams({ metadata }, [PropertyMetadata]);
        __Validation.assertAttachedProperty(target, name, false);

        const property = new DependencyProperty();
        if (__Registry.tryRegisterAttached(target, property, name, metadata))
            return property;
        throw new InvalidOperationException("Cannot register dependency property. Property may already be registered.");
    }

    static registerReadonly(target: Type, name: string, metadata: PropertyMetadata): DependencyPropertyKey {
        assertParams({ target }, [Type]);
        assertParams({ options: metadata }, [PropertyMetadata]);
        __Validation.assertAttachedProperty(target, name, true);

        const property = new DependencyProperty();
        const propertyKey = new DependencyPropertyKey();
        if (__Registry.tryRegisterReadonly(target, property, name, propertyKey, metadata))
            return propertyKey;
        throw new InvalidOperationException("Cannot register dependency property. Property may already be registered.");
    }

    static register(target: Type, name: string, metadata: PropertyMetadata): DependencyProperty {
        assertParams({ target }, [Type]);
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

    static getAll(targetType: Type) {
        assertParams({ targetType }, [Type]);

        return __Registry.getAll(targetType);
    }

    get name(): string {
        const tryGetPropertyNameOutput: OutputArgument<string> = {};
        if (__Registry.tryGetName(this, tryGetPropertyNameOutput))
            return tryGetPropertyNameOutput.value!;
        throw new InvalidOperationException("Cannot get name. Invalid dependency property.");
    }

    get id() { return this.__id ?? (() => { throw new InvalidOperationException("Cannot get id. Invalid DependencyProperty instance.") })() }
    __id: Guid | null = null;
}