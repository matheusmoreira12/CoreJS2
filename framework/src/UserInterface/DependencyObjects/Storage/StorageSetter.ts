import { DependencyProperty } from "../index";
import { DependencyObject } from "../DependencyObject";

export type StorageSetter = {
    source: object;
    target: DependencyObject;
    property: DependencyProperty;
    value: any;
}

export namespace StorageSetter {
    export function create(source: object, target: DependencyObject, property: DependencyProperty, value: any): StorageSetter {
        return {
            source,
            target,
            property,
            value
        };
    }
}