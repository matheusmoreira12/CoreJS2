export function invert<TKey, TValue>(value: Map<TKey, TValue>): Map<TValue, TKey> {
    function* generateInvertedEntries(): Generator<[TValue, TKey]> {
        for (let entry of value)
            yield [entry[1], entry[0]];
    }

    return new Map<TValue, TKey>(generateInvertedEntries());
}