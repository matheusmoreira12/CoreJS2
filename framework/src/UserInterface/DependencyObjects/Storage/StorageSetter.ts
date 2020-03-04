import { DependencyProperty } from "../index";

export type StorageSetter = {
    source: object;
    target: object;
    property: DependencyProperty;
    value: any;
}

export namespace StorageSetter {
    export function create(source: object, target: object, property: DependencyProperty, value: any): StorageSetter {
        return {
            source,
            target,
            property,
            value
        };
    }
}