import { Control } from "../index.js";
import { Properties } from "./properties";

export type NativeControlPrototype<T extends typeof Element> = Control & {
    [K in Properties<T>]: T["prototype"][K];
};
