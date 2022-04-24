import { Enumerable, IEnumerable, IEnumerator, ZippedEnumerator } from "./index.js";
import { ZippedEnumerableValue } from "./zipped-enumerable-value";

export class ZippedEnumerable<TSourceEnumerables extends IEnumerable[]> extends Enumerable<ZippedEnumerableValue<TSourceEnumerables>> {
    constructor(sourceEnumrables: TSourceEnumerables) {
        super();

        this._sourceEnumerables = sourceEnumrables;
    }

    getEnumerator(): IEnumerator<ZippedEnumerableValue<TSourceEnumerables>> {
        const enumerators = this._sourceEnumerables.map(enumerable => enumerable.getEnumerator());
        return new ZippedEnumerator(enumerators) as IEnumerator<ZippedEnumerableValue<TSourceEnumerables>>;
    }

    private readonly _sourceEnumerables: TSourceEnumerables;
}
