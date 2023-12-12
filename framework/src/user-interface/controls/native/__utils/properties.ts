import { ObjectUtils } from "../../../../core-base/utils/index.js";
import { PropertyNameFromNativePropertyName, getSubstitutedPropertyName, isNativePropertyName, isSubstitutedPropertyName } from "./index.js";

export type Properties<T extends typeof Element> = {
    readonly [K in keyof T["prototype"] & string as PropertyNameFromNativePropertyName<K>]: T["prototype"][K]
};

export function getNativeAndSubstitutedPropertyNames<T extends typeof Element>(elemCtor: T): [string, string | null][] {
    return [...ObjectUtils.getAllPropertyNames(elemCtor.prototype)].filter(p => isNativePropertyName(p)).map(p => [p, isSubstitutedPropertyName(p) ? getSubstitutedPropertyName(p) : null]);
}