export namespace MapUtils {
    export function invert<TKey, TValue>(value: Map<TKey, TValue>): Map<TValue, TKey> {
        function* generateInvertedEntries(): Generator<[TValue, TKey]> {
            for (let entry of value)
                yield [entry[1], entry[0]];
        }

        return new Map<TValue, TKey>(generateInvertedEntries());
    }

    export function* select<TKey, TValue, TResult>(value: Map<TKey, TValue>, predicate: (key: TKey, value: TValue) => TResult): IterableIterator<TResult> {
        for (let item of value)
            yield predicate(item[0], item[1]);
    }

    export function selectSet<TKey, TValue, TResult>(value: Map<TKey, TValue>, predicate: (key: TKey, value: TValue) => TResult): Set<TResult> {
        return new Set<TResult>(select(value, predicate));
    }

    export function* selectMap<TKey, TValue, TResultKey, TResultValue>(value: Map<TKey, TValue>, predicate: (key: TKey, value: TValue) => [TResultKey, TResultValue]): IterableIterator<Map<TResultKey, TResultValue>> {
        return new Map<TResultKey, TResultValue>(select(value, predicate));
    }
}