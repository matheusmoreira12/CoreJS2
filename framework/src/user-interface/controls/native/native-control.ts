import { NativeControlPrototype } from "./native-control-prototype";
import { DependencyProperties } from "./dependency-properties";

export type NativeControl<T extends typeof Element> = { new(): NativeControlPrototype<T>; prototype: NativeControlPrototype<T>; } & DependencyProperties<T>;