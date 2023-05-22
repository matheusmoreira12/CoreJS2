import { SUBSTITUTED_PROPERTIES } from "./substituted-properties.js";

export type SubstitutedPropertyName<K extends string> = K extends keyof typeof SUBSTITUTED_PROPERTIES ? typeof SUBSTITUTED_PROPERTIES[K] : never;

export function getSubstitutedPropertyNameOrNull(name: string): string | null {
    return SUBSTITUTED_PROPERTIES[name as keyof typeof SUBSTITUTED_PROPERTIES] ?? null;
}