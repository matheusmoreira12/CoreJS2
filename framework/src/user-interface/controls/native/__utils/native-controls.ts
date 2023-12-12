import { DataMap, DataMapItem, NativeControl } from "./index";

type ElementCtorFromTuple<TTuple extends DataMapItem> = ElementCtorFromName<TTuple["ctorName"]>;

type ElementCtorFromName<TName> = typeof globalThis[TName & keyof typeof globalThis] & typeof Element;

export type NativeControls<TTuples extends DataMap> = {
    readonly [I in keyof TTuples & string as I]: NativeControl<ElementCtorFromTuple<TTuples[I]>>;
};