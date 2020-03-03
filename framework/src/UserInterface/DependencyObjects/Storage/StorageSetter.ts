import { DependencyProperty } from "../index";
import { IDependencyObject } from "../DependencyObject";

export type StorageSetter = {
    source: object;
    target: IDependencyObject;
    property: DependencyProperty;
    value: any;
}

export namespace StorageSetter {
    export function create(source: object, target: IDependencyObject, property: DependencyProperty, value: any): StorageSetter {
        return {
            source,
            target,
            property,
            value
        };
    }
}