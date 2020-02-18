import { DependencyProperty, PropertyMetadata } from "../index";

export type MetadataOverride = {
    property: DependencyProperty;
    metadata: PropertyMetadata;
}

export namespace MetadataOverride {
    export function create(property: DependencyProperty, metadata: PropertyMetadata) {
        return {
            property: property,
            metadata: metadata
        }
    }
}