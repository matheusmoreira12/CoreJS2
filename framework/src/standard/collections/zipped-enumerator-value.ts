import { IEnumerator } from "./index.js";

type UnwrapEnumeratorValue<TEnumerator> = TEnumerator extends IEnumerator<infer T> ? T : TEnumerator;
type UnwrapEnumeratorsValues<TEnumerables> = TEnumerables extends [infer THead, ...infer TTail] ? [UnwrapEnumeratorValue<THead>, ...UnwrapEnumeratorsValues<TTail>] : [];

export type ZippedEnumeratorValue<TSourceEnumerators extends IEnumerator[]> = UnwrapEnumeratorsValues<TSourceEnumerators>;