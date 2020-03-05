import { DependencyProperty } from "./DependencyProperty";
import { IPropertyOptions } from "./IPropertyOptions";

type RegistryEntry = {
    target: typeof Object,
    property: DependencyProperty,
    options: IPropertyOptions
}

const registryEntries: RegistryEntry[] = [];

export function register(target: typeof Object, property: DependencyProperty, options: IPropertyOptions = {}) {
    registryEntries.push({
        target,
        property,
        options
    });
}