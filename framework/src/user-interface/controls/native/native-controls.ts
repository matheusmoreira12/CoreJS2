import { HTML_ELEMENT_DATA_TUPLES } from "./html-element-data-tuples";
import { NativeControl } from "./native-control";

type DataTuples = readonly DataTuple[];

type DataTuple = readonly [string, string, string];

type ElementCtorFromTuple<TTuple extends DataTuple> = ElementCtorFromName<TTuple[2]>;

type TagNameFromTuple<TTuple extends DataTuple> = TTuple[0];

type ElementCtorFromName<TName> = typeof globalThis[TName & keyof typeof globalThis] & typeof Element;

export type NativeControls<TTuples extends DataTuples> = {
    readonly [I in number as TagNameFromTuple<TTuples[I]>]: NativeControl<ElementCtorFromTuple<TTuples[I]>>;
};