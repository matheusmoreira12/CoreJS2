import { DependencyProperty, PropertyMetadata } from "../index";

export type MetadataOverride = {
    property: DependencyProperty;
    metadata: PropertyMetadata;
}

export function createMetadataOverride(property: DependencyProperty, metadata: PropertyMetadata) {
    return {
        property: property,
        metadata: metadata
    }
}