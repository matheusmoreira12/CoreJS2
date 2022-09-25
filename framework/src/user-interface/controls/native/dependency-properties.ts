import { DependencyProperty } from "../../../standard/dependency-objects/dependency-property";

type GetDependencyPropertyName<K extends string> = K extends `on${string}` ? never : `${K}Property`;

export type DependencyProperties<T extends typeof Element> = {
    readonly [K in keyof T["prototype"] & string as GetDependencyPropertyName<K> & GetDependencyPropertyName<K>] : DependencyProperty
};