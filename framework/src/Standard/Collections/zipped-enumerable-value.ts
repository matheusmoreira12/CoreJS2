import { IEnumerable } from "./index.js";

type UnwrapEnumerableValue<TEnumerable> = TEnumerable extends IEnumerable<infer T> ? T : TEnumerable;
type UnwrapEnumerablesValues<TEnumerables extends any[]> = TEnumerables extends [infer THead, ...infer TTail] ? [UnwrapEnumerableValue<THead>, ...UnwrapEnumerablesValues<TTail>] : [];

export type ZippedEnumerableValue<TSourceEnumerables extends IEnumerable[]> = UnwrapEnumerablesValues<TSourceEnumerables>;