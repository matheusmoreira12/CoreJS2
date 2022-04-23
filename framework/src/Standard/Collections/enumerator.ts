import { NotImplementedException } from "../exceptions/index.js";
import { IEnumerator } from "./index.js";

export class Enumerator<T = any> implements IEnumerator<T> {
    next(): IteratorResult<T> {
        throw new NotImplementedException();
    }
}
