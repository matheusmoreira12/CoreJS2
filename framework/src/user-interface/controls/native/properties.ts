import { EventName } from "./event-name";
import { ExcludedProperty } from "./excluded-property";
import { SubstitutedPropertyName } from "./substituted-property";

type GetPropertyName<K extends string> = K extends ExcludedProperty ? never : K extends EventName ? never : SubstitutedPropertyName<K> | K;

export type Properties<T extends typeof Element> = {
    readonly [K in keyof T["prototype"] & string as GetPropertyName<K>]: T["prototype"][K]
};
