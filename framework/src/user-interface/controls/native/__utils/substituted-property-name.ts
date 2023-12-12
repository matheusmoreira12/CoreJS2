import { SUBSTITUTED_PROPERTY_NAMES } from "./index.js";

export type SubstitutedPropertyName<K extends string> = K extends keyof typeof SUBSTITUTED_PROPERTY_NAMES ? typeof SUBSTITUTED_PROPERTY_NAMES[K] : never;

export function isSubstitutedPropertyName(prop: string): boolean {
    return SUBSTITUTED_PROPERTY_NAMES.hasOwnProperty(prop);
}

export function getSubstitutedPropertyName(name: string): string | null {
    return SUBSTITUTED_PROPERTY_NAMES[name as keyof typeof SUBSTITUTED_PROPERTY_NAMES];
}