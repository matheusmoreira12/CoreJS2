import { DependencyProperties, NativeControlPrototype } from "./index";

export type NativeControl<T extends typeof Element> = { new(): NativeControlPrototype<T>; prototype: NativeControlPrototype<T>; } & DependencyProperties<T>;