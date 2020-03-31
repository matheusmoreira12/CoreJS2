import { DependencyProperty } from "./DependencyProperty";
import { IPropertyOptions } from "./IPropertyOptions";
import { Class } from "../../Standard/Types/Types";

type RegistryEntry = {
    target: typeof Object,
    property: DependencyProperty,
    options: IPropertyOptions
}

const registryEntries: RegistryEntry[] = [];

export function register(target: Class<any>, property: DependencyProperty, options: IPropertyOptions) {
    registryEntries.push({
        target,
        property,
        options
    });
}

export function getOptions(property: DependencyProperty): IPropertyOptions | null {
    const entry = registryEntries.find(e => e.property === property);
    if (entry)
        return entry.options;
    else
        return null;
}