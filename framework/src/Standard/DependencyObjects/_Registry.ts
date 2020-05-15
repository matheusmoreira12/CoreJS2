import { DependencyProperty } from "./DependencyProperty.js";
import { IPropertyMetadata } from "./IPropertyMetadata.js";
import { Class } from "../Types/Types.js";

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
    const entry = registryEntries.find(e => e.property === property);
    if (entry)
        return entry.metadata;
    else
        return null;
}

export function getAll(target: Class<any>): DependencyProperty[] {
    const entries = registryEntries.filter(e => e.target === target);
    return entries.map(e => e.property);
}