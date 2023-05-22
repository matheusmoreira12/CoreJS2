import { EXCLUDED_PROPERTIES as EXCLUDED_PROPERTY_NAMES } from "./excluded-properties.js";

export type ExcludedProperty = typeof EXCLUDED_PROPERTY_NAMES[number];

export function isExcludedProperty(name: string) {
    return EXCLUDED_PROPERTY_NAMES.includes(name as typeof EXCLUDED_PROPERTY_NAMES[number]);
}