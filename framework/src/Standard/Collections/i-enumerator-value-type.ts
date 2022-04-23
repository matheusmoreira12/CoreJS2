import { IEnumerator } from "./index";

export type IEnumeratorValueType<TEnumerator extends IEnumerator> = TEnumerator extends IEnumerator<infer T> ? T : never;
