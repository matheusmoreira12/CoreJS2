import { DependencyProperty } from "./dependency-property.js";
import { IPropertyMetadata } from "./i-property-metadata.js";
import { ClassOf } from "../reflection/types.js";

type RegistryEntry = {
    target: typeof Object,
    property: DependencyProperty,
    metadata: IPropertyMetadata,
    isAttached: boolean,
    isReadonly: boolean
}

const registryEntries: RegistryEntry[] = [];

export function registerAttached(target: ClassOf<any>, property: DependencyProperty, metadata: IPropertyMetadata) {
    registryEntries.push({
        target,
        property,
        metadata,
        isAttached: true,
        isReadonly: false
    });
}

export function registerReadonly(target: ClassOf<any>, property: DependencyProperty, metadata: IPropertyMetadata) {
    registryEntries.push({
        target,
        property,
        metadata,
        isAttached: true,
        isReadonly: true
    });
}

export function register(target: ClassOf<any>, property: DependencyProperty, metadata: IPropertyMetadata) {
    registryEntries.push({
        target,
        property,
        metadata,
        isAttached: false,
        isReadonly: true
    });
}

export function getMetadata(property: DependencyProperty): IPropertyMetadata | null {
    for (let entry of registryEntries) {
        if (entry.property === property)
            return entry.metadata;
    }
    return null;
}

export function* getAll(target: ClassOf<any>): IterableIterator<DependencyProperty> {
    for (let entry of registryEntries) {
        if (entry.target === target)
            yield entry.property;
    }
}