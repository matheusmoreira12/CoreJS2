import { DependencyProperty } from "../../../standard/dependency-objects/dependency-property";
import { EventName } from "./event-name";
import { ExcludedProperty } from "./excluded-property";
import { SubstitutedPropertyName } from "./substituted-property";

type DependencyPropertyName<K extends string> = K extends ExcludedProperty ? never : K extends EventName ? never : `${SubstitutedPropertyName<K> | K}Property`;

export type DependencyProperties<T extends typeof Element> = {
    readonly [K in keyof T["prototype"] & string as DependencyPropertyName<K>]: DependencyProperty
};