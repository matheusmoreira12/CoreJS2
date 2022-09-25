import { DependencyObject } from "./index.js";

export type DependencyObjectClass = Function & { prototype: DependencyObject };
