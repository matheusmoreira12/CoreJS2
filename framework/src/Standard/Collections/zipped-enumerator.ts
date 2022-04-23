import { IEnumeratorValueType } from "./i-enumerator-value-type";
import { Enumerator, IEnumerator } from "./index.js";

export class ZippedEnumerator<TSourceEnumerators extends IEnumerator[]> extends Enumerator<IEnumeratorValueType<TSourceEnumerators[number]>[]> {
    constructor(sourceEnumerators: TSourceEnumerators) {
        super();

        this._sourceEnumerators = sourceEnumerators;
    }

    next(): IteratorResult<IEnumeratorValueType<TSourceEnumerators[number]>[]> {
        const results = this._sourceEnumerators.map(enumerator => enumerator.next());
        return {
            value: results.map(result => result.value),
            done: results.every(result => result.done)
        };
    }

    private readonly _sourceEnumerators: TSourceEnumerators;
}
