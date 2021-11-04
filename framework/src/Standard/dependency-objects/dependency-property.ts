import { ValueType } from "./types";

import { assertParams } from "../../validation/index.js";
import { InvalidOperationException } from "../exceptions/index.js";
import { ClassOf } from "../reflection/index.js";
import { DependencyObject, DependencyPropertyKey, PropertyMetadata } from "./index.js";

import { _Registry } from "./_registry.js";

type InferValueType<TMetadata> = TMetadata extends PropertyMetadata<infer U> ? U : never;

function assertAttachedProperty(target: Function, name: string, isReadonly: boolean) {
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
export class DependencyProperty<TTarget extends ClassOf<DependencyObject> = any, TName extends string = any, TMetadata extends PropertyMetadata = any> {
    static registerAttached<TTarget extends ClassOf<DependencyObject>, TName extends string, TMetadata extends PropertyMetadata>(target: TTarget, name: TName, metadata: TMetadata): DependencyProperty<TTarget, TName, TMetadata> {
        assertParams({ target }, [Function]);
        assertParams({ metadata }, [PropertyMetadata]);

        assertAttachedProperty(target, name, false);

        const property = new DependencyProperty();
        _Registry.registerAttachedProperty(target, property, name, metadata);
        return property;
    }

    static registerReadonly<TTarget extends ClassOf<DependencyObject>, TName extends string, TMetadata extends PropertyMetadata>(target: TTarget, name: TName, metadata: TMetadata): DependencyPropertyKey<DependencyProperty<TTarget, TName, TMetadata>> {
        assertParams({ target }, [Function]);
        assertParams({ options: metadata }, [PropertyMetadata]);
        assertAttachedProperty(target, name, true);

        const property = new DependencyProperty();
        const propertyKey = new DependencyPropertyKey();
        _Registry.registerReadonlyProperty(target, property, name, propertyKey, metadata);

        return propertyKey;
    }

    static register<TTarget extends ClassOf<DependencyObject>, TName extends string, TMetadata extends PropertyMetadata>(target: TTarget, name: TName, metadata: PropertyMetadata<InferValueType<TMetadata>>): DependencyProperty<TTarget, TName, TMetadata> {
        assertParams({ target }, [Function]);
        assertParams({ metadata }, [PropertyMetadata]);

        const property = new DependencyProperty();
        _Registry.registerProperty(target, property, name, metadata);
        return property;
    }

    static getMetadata<TTarget extends ClassOf<DependencyObject>, TMetadata extends PropertyMetadata>(property: DependencyProperty<TTarget, any, TMetadata>): TMetadata {
        assertParams({ property }, [DependencyProperty]);

        const metadata = _Registry.getPropertyMetadata(property);
        if (metadata)
            return metadata as TMetadata;
        else
            throw new InvalidOperationException("Cannot get metadata. Invalid dependency property.")
    }

    static getAll(target: ClassOf<DependencyObject>): IterableIterator<DependencyProperty> {
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