import { Enumerable } from "./enumerable";
import { IEnumeratorValueType } from "./i-enumerator-value-type";
import { Enumerator, IEnumerator } from "./index.js";
import { ZippedEnumeratorValue } from "./zipped-enumerator-value";

export class ZippedEnumerator<TSourceEnumerators extends IEnumerator[]> extends Enumerator<ZippedEnumeratorValue<TSourceEnumerators>> {
    constructor(sourceEnumerators: TSourceEnumerators) {
        super();

        this._sourceEnumerators = sourceEnumerators;
    }

    next(): IteratorResult<ZippedEnumeratorValue<TSourceEnumerators>> {
        const results = this._sourceEnumerators.map(enumerator => enumerator.next());
        return {
            value: results.map(result => result.value) as ZippedEnumeratorValue<TSourceEnumerators>,
            done: results.some(result => result.done)
        };
    }

    private readonly _sourceEnumerators: TSourceEnumerators;
}


var x: ZippedEnumeratorValue<[Enumerator<number>, Enumerator<string>]>;