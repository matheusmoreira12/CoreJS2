import { DependencyProperty } from "./dependency-property.js";
import { PropertyMetadata } from "./property-metadata.js";
import { ClassOf } from "../reflection/types.js";
import { DependencyPropertyKey } from "./index.js";

export namespace _Registry {
    type RegistryEntry = {
        property: DependencyProperty,
        propertyName: string,
        target: ClassOf<Object>,
        propertyKey?: DependencyPropertyKey,
        metadata: PropertyMetadata,
        isAttached: boolean,
        isReadonly: boolean
    }

    const registryEntries: RegistryEntry[] = [];

    export function registerAttachedProperty(target: ClassOf<object>, property: DependencyProperty, propertyName: string, metadata: PropertyMetadata) {
        registryEntries.push({
            property,
            propertyName,
            target,
            metadata,
            isAttached: true,
            isReadonly: false
        });
    }

    export function registerReadonlyProperty(target: ClassOf<object>, property: DependencyProperty, propertyName: string, propertyKey: DependencyPropertyKey, metadata: PropertyMetadata) {
        registryEntries.push({
            property,
            propertyName,
            propertyKey,
            target,
            metadata,
            isAttached: true,
            isReadonly: true
        });
    }

    export function registerProperty(target: ClassOf<object>, property: DependencyProperty, propertyName: string, metadata: PropertyMetadata) {
        registryEntries.push({
            property,
            propertyName,
            target,
            metadata,
            isAttached: false,
            isReadonly: true
        });
    }

    export function getPropertyMetadata(property: DependencyProperty): PropertyMetadata | null {
        return registryEntries.find(entry => entry.property === property)?.metadata || null;
    }

    export function getPropertyName(property: DependencyProperty): string | null {
        return registryEntries.find(entry => entry.property === property)?.propertyName || null;
    }

    export function getIsPropertyReadonly(property: DependencyProperty): boolean | null {
        return registryEntries.find(entry => entry.property == property)?.isReadonly || null;
    }

    export function getPropertyFromPropertyKey(propertyKey: DependencyPropertyKey): DependencyProperty | null {
        return registryEntries.find(entry => entry.propertyKey === propertyKey)?.property || null;
    }

    export function* getAllProperties(target: ClassOf<any>): IterableIterator<DependencyProperty> {
        return registryEntries.filter(entry => entry.target === target);
    }
}