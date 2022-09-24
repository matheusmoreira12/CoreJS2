import { EXCLUDED_PROPERTIES } from "./excluded-properties";

export type Properties<T extends typeof Element> = Exclude<keyof T["prototype"] & string, typeof EXCLUDED_PROPERTIES[number]>;
