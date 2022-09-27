export namespace ArrayUtils {
    export function remove<T>(array: T[], item: T): void {
        let i = array.indexOf(item);
        if (i == -1)
            return;
        array.splice(i, 1);
    }

    export function removeMany<T>(array: T[], items: Iterable<T>): void {
        for (let v of items)
            remove(array, v);
    }

    export function removeWhere<T>(array: T[], predicate: (item: T) => boolean): void {
        removeMany(array, where(array, predicate));
    }

    export function* concat<T>(a: IterableIterator<T>, b: IterableIterator<T>): IterableIterator<T> {
        yield* a;
        yield* b;
    }

    export function first<T>(iterable: Iterable<T>): T | undefined;
    export function first<T>(iterable: Iterable<T>, predicate: (item: T) => boolean): T | undefined;
    export function first<T>(iterable: Iterable<T>, predicate?: (item: T) => boolean): T | undefined {
        if (predicate)
            return first(where(iterable, predicate));
        const i = iterable[Symbol.iterator]();
        const ir = i.next();
        if (i.return)
            i.return();
        return ir.value;
    }

    export function last<T>(iterable: Iterable<T>): T | undefined;
    export function last<T>(iterable: Iterable<T>, predicate: (item: T) => boolean): T | undefined;
    export function last<T>(iterable: Iterable<T>, predicate?: (item: T) => boolean): T | undefined {
        if (predicate)
            return last(where(iterable, predicate));
        const i = iterable[Symbol.iterator]();
        let v: T | undefined = undefined;
        while (true) {
            const ir = i.next();
            if (ir.done)
                break;
            v = ir.value;
        }
        if (i.return)
            i.return();
        return v;
    }

    export function* exclude<T>(iterable: Iterable<T>, excludeItem: T): IterableIterator<T> {
        for (let v of iterable) {
            if (v === excludeItem)
                continue;
            yield v;
        }
    }

    export function* excludeMany<T>(iterable: Iterable<T>, excludeItems: Iterable<T>): IterableIterator<T> {
        let r = iterable;
        for (let ev of excludeItems)
            r = exclude(r, ev);
        yield* r;
    }

    export function* unique<T>(iterable: Iterable<T>): IterableIterator<T> {
        const us: T[] = [];
        for (let v of iterable) {
            if (us.includes(v))
                continue;
            us.push(v);
            yield v;
        }
    }

    export function* select<T, TResult>(iterable: Iterable<T>, predicate: (item: T) => TResult): IterableIterator<TResult> {
        for (let v of iterable)
            yield predicate(v);
    }

    export function* selectMany<T, TResult>(iterable: Iterable<T>, predicate: (item: T) => Iterable<TResult>): IterableIterator<TResult> {
        for (let v of iterable)
            yield* predicate(v);
    }

    export function* selectChunks<T, TResult>(iterable: Iterable<T>, chunkLength: number, predicate: (chunk: T[]) => TResult): IterableIterator<TResult> {
        const it = iterable[Symbol.iterator]();
        let c: T[] = [];
        for (let i = 0; ; i++) {
            const ir = it.next();
            if (ir.done)
                break;
            const j = i % chunkLength;
            if (j == 0)
                c = [];
            c.push(ir.value);
            if (j == chunkLength - 1) {
                yield predicate(c);
            }
        }
        if (it.return)
            it.return();
    }

    export function selectSet<T, TResult>(iterable: Iterable<T>, predicate: (item: T) => TResult): Set<TResult> {
        return new Set<TResult>(select(iterable, predicate));
    }

    export function selectMap<T, TResultKey, TResultValue>(iterable: Iterable<T>, predicate: (item: T) => [TResultKey, TResultValue]): Map<TResultKey, TResultValue> {
        return new Map<TResultKey, TResultValue>(select(iterable, predicate));
    }

    export function* where<T>(iterable: Iterable<T>, predicate: (value: T) => boolean): IterableIterator<T> {
        for (let v of iterable) {
            if (!predicate(v))
                continue;
            yield v;
        }
    }

    export function sequenceEqual<T>(a: Iterable<T>, b: Iterable<T>): boolean {
        const ia = a[Symbol.iterator]();
        const ib = b[Symbol.iterator]();
        while (true) {
            const iar = ia.next();
            const ibr = ib.next();
            if (iar.done || ibr.done) {
                if (!iar.done || !ibr.done)
                    return false;
                break;
            }
            if (iar.value !== ibr.value)
                return false;
        }
        if (ia.return)
            ia.return();
        if (ib.return)
            ib.return();
        return true;
    }

    type ZipIterables<T extends any[]> = Iterable<unknown>[] & { [I in number]: Iterable<T[number]> };

    export function* zip<T extends any[], TResult>(predicate: (...items: T) => TResult, ...iterables: ZipIterables<T>): Iterable<TResult> {
        const is = iterables.map(i => i[Symbol.iterator]());
        while (true) {
            let q = false;
            const vs: T[number][] = [];
            for (let i of is) {
                const ir = i.next();
                if (ir.done) {
                    q = true;
                    break;
                }
                vs.push(ir.value);
            }
            if (q)
                break;
            yield predicate(...(vs as T));
        }
    }
}