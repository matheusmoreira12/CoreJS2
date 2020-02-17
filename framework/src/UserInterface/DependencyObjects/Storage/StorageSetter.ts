import { DependencyProperty } from "../DependencyProperty";

export type StorageSetter = {
    source: object;
    property: DependencyProperty;
    value: any;
}

export function createStorageSetter(source: object, property: DependencyProperty, value: any): StorageSetter {
    return {
        source,
        property,
        value
    };
}