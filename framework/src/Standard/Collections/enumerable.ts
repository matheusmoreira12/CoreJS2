import { InvalidOperationException, NotImplementedException } from "../exceptions/index.js";
import { IEnumerable, IEnumerator } from "./index.js";

export class Enumerable<T> implements IEnumerable<T> {
    constructor(){
        if (new.target === Enumerable)
            throw new InvalidOperationException("Invalid constructor.");
    }

    [Symbol.iterator](): IEnumerator<T> { return this.getEnumerator(); }

    getEnumerator(): IEnumerator<T> {
        throw new NotImplementedException();
    }
}