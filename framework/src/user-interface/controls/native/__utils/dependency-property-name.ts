import { PropertyNameFromNativePropertyName, SubstitutedPropertyName } from "./index";

export type DependencyPropertyName<K extends string> = K extends PropertyNameFromNativePropertyName<K> ? `${SubstitutedPropertyName<K> | K}Property` : never;
