import { Interface, InterfaceFunction } from "../interfaces/index.js";

export interface IEnumerator<T = any> extends Iterator<T> { }

// export const IEnumerator = new Interface(
//     new InterfaceFunction("next")
// )