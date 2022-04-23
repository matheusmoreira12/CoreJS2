import { IEnumerable } from "./index";

export type IEnumerableValueType<TEnumerable extends IEnumerable> = TEnumerable extends IEnumerable<infer T> ? T : never;
