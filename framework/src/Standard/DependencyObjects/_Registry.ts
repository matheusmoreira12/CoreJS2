import { DependencyProperty } from "./DependencyProperty.js";
import { IPropertyMetadata } from "./IPropertyMetadata.js";
import { Class } from "../Reflection/Types.js";

type RegistryEntry = {
    target: typeof Object,
    property: DependencyProperty,
    metadata: IPropertyMetadata,
    isAttached: boolean,
    isReadonly: boolean
}

const registryEntries: RegistryEntry[] = [];

export function registerAttached(target: Class<any>, property: DependencyProperty, metadata: IPropertyMetadata) {
    registryEntries.push({
        target,
        property,
        metadata,
        isAttached: true,
        isReadonly: false
    });
}

export function registerReadonly(target: Class<any>, property: DependencyProperty, metadata: IPropertyMetadata) {
    registryEntries.push({
        target,
        property,
        metadata,
        isAttached: true,
        isReadonly: true
    });
}

export function register(target: Class<any>, property: DependencyProperty, metadata: IPropertyMetadata) {
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

export function* getAll(target: Class<any>): IterableIterator<DependencyProperty> {
    for (let entry of registryEntries) {
        if (entry.target === target)
            yield entry.property;
    }
}