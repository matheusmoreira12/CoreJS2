import { DependencyProperty } from "../../../../standard/dependency-objects/index";
import { DependencyPropertyName } from "./index";

export type DependencyProperties<T extends typeof Element> = {
    readonly [K in keyof T["prototype"] & string as DependencyPropertyName<K>]: DependencyProperty
};