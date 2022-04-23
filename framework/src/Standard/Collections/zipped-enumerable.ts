import { IEnumerableValueType } from "./i-enumerable-value-type";
import { Enumerable, IEnumerable, IEnumerator, ZippedEnumerator } from "./index.js";

export class ZippedEnumerable<TSourceEnumerables extends IEnumerable[]> extends Enumerable<IEnumerableValueType<TSourceEnumerables[number]>[]> {
    constructor(sourceEnumrables: TSourceEnumerables) {
        super();

        this._sourceEnumerables = sourceEnumrables;
    }

    getEnumerator(): IEnumerator<IEnumerableValueType<TSourceEnumerables[number]>[]> {
        const enumerators = this._sourceEnumerables.map(enumerable => enumerable.getEnumerator());
        return new ZippedEnumerator(enumerators);
    }

    private readonly _sourceEnumerables: TSourceEnumerables;
}
