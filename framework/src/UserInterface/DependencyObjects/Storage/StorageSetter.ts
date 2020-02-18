import { DependencyProperty } from "../index";

export type StorageSetter = {
    source: object;
    property: DependencyProperty;
    value: any;
}

export namespace StorageSetter {
    export function create(source: object, property: DependencyProperty, value: any): StorageSetter {
        return {
            source,
            property,
            value
        };
    }
}