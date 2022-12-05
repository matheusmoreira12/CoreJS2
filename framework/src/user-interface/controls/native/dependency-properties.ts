import { DependencyProperty } from "../../../standard/dependency-objects/dependency-property";

type DependencyPropertyName<K extends string> = K extends `on${string}` ? never : `${K}Property`;

export type DependencyProperties<T extends typeof Element> = {
    readonly [K in keyof T["prototype"] & string as DependencyPropertyName<K> & DependencyPropertyName<K>] : DependencyProperty
};