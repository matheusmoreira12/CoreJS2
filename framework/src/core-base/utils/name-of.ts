import { NameOfMap } from "./name-of-map";

export type NameOf<TNameMap extends NameOfMap> = keyof TNameMap & string;
