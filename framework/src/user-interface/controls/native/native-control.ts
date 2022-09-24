import { DependencyProperty } from "../../../standard/dependency-objects/index.js";
import { Properties } from "./properties";
import { NativeControlPrototype } from "./native-control-prototype";


export type NativeControl<T extends typeof Element> = { new(): NativeControlPrototype<T>; prototype: NativeControlPrototype<T>; } & {
    readonly [K in Properties<T> as `${K}Property`]: DependencyProperty;
};
