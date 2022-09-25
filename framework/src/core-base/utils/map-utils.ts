export namespace MapUtils {
    export function deleteMany<TKey, TValue>(map: Map<TKey, TValue>, keys: Iterable<TKey>): void {
        for (let k of keys)
            map.delete(k);
    }

    export function invert<TKey, TValue>(map: Map<TKey, TValue>): Map<TValue, TKey> {
        return new Map<TValue, TKey>(g());

        function* g(): Generator<[TValue, TKey]> {
            for (let [k, v] of map)
                yield [v, k];
        }
    }

    export function* select<TKey, TValue, TResult>(map: Map<TKey, TValue>, predicate: (key: TKey, value: TValue) => TResult): IterableIterator<TResult> {
        for (let kv of map)
            yield predicate(kv[0], kv[1]);
    }

    export function selectSet<TKey, TValue, TResult>(map: Map<TKey, TValue>, predicate: (key: TKey, value: TValue) => TResult): Set<TResult> {
        return new Set<TResult>(select(map, predicate));
    }

    export function selectMap<TKey, TValue, TResultKey, TResultValue>(map: Map<TKey, TValue>, predicate: (key: TKey, value: TValue) => [TResultKey, TResultValue]): Map<TResultKey, TResultValue> {
        return new Map<TResultKey, TResultValue>(select(map, predicate));
    }

    export function where<TKey, TValue>(map: Map<TKey, TValue>, predicate: (key: TKey, value: TValue) => boolean): Map<TKey, TValue> {
        return new Map(g());

        function* g(): IterableIterator<[TKey, TValue]> {
            for (let kv of map) {
                if (!predicate(kv[0], kv[1]))
                    continue;
                yield kv;
            }
        }
    }

    export function* keysWhere<TKey, TValue>(map: Map<TKey, TValue>, predicate: (key: TKey, value: TValue) => boolean): IterableIterator<TKey> {
        for (let [k, v] of map) {
            if (!predicate(k, v))
                continue;
            yield k;
        }
    }

    export function* valuesWhere<TKey, TValue>(map: Map<TKey, TValue>, predicate: (key: TKey, value: TValue) => boolean): IterableIterator<TValue> {
        for (let [k, v] of map) {
            if (!predicate(k, v))
                continue;
            yield v;
        }
    }
}