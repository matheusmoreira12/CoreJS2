import { EXCLUDED_PROPERTY_NAMES, EventPropertyName, ExcludedProperty, SUBSTITUTED_PROPERTY_NAMES, SubstitutedPropertyName, isEventPropertyName } from "./index.js";

export type PropertyNameFromNativePropertyName<K extends string> = K extends ExcludedProperty ? never : K extends EventPropertyName ? never : SubstitutedPropertyName<K> | K;

export function isNativePropertyName(prop: string): boolean {
    return !isEventPropertyName(prop) && !EXCLUDED_PROPERTY_NAMES.includes(prop as typeof EXCLUDED_PROPERTY_NAMES[number]);
}