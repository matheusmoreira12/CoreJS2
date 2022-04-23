import { Interface, InterfaceFunction } from "../interfaces/index.js";
import { IEnumerator } from "./index.js";

export interface IEnumerable<T = any> extends Iterable<T> {
    getEnumerator(): IEnumerator<T>;
}

export const IEnumerable = new Interface(
    new InterfaceFunction("getEnumerator"),
    new InterfaceFunction(Symbol.iterator)
);
