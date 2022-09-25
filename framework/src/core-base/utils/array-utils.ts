export namespace ArrayUtils {
    export function remove<T>(array: T[], item: T): void {
        let i = array.indexOf(item);
        if (i === -1)
            return;
        array.splice(i, 1);
    }

    export function removeMany<T>(array: T[], items: Iterable<T>): void {
        for (let v of items)
            remove(array, v);
    }

    export function removeWhere<T>(array: T[], predicate: (item: T, i: number) => boolean): void {
        removeMany(array, where(array, predicate));
    }

    export function* compareSelect<T, U, TResult>(a: Iterable<T>, b: Iterable<U>, predicate: (a: T, b: U, i: number) => TResult) {
        const ia = a[Symbol.iterator]();
        const ib = b[Symbol.iterator]();
        let iar: IteratorResult<T>;
        let ibr: IteratorResult<U>;
        let i = 0;
        do {
            iar = ia.next();
            ibr = ib.next();
            const pr = predicate(iar.value, iar.value, i);
            yield pr;
            i++;
        }
        while (!iar.done && !ibr.done);
        if (ia.return)
            ia.return();
        if (ib.return)
            ib.return();
    }

    export function getFirst<T>(iterable: Iterable<T>): T | undefined {
        const it = iterable[Symbol.iterator]();
        const ir = it.next();
        if (it.return)
            it.return();
        return ir.value;
    }

    export function getLast<T>(iterable: Iterable<T>): T | undefined {
        const it = iterable[Symbol.iterator]();
        let ir = it.next();
        while (true) {
            const nir = it.next();
            if (nir.done)
                break;
            ir = nir;
        }
        if (it.return)
            it.return();
        return ir.value;
    }

    export function* exclude<T>(iterable: Iterable<T>, excludeItem: T): IterableIterator<T> {
        for (let v of iterable) {
            if (v == excludeItem)
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

    export function* excludeDuplicates<T>(iterable: Iterable<T>): IterableIterator<T> {
        const rv: T[] = [];
        for (let v of iterable) {
            if (rv.includes(v))
                continue;
            rv.push(v);
            yield v;
        }
    }

    export function* select<T, TResult>(iterable: Iterable<T>, predicate: (item: T, i: number) => TResult): IterableIterator<TResult> {
        let i = 0;
        for (let v of iterable) {
            yield predicate(v, i);
            i++;
        }
    }

    export function selectSet<T, TResult>(iterable: Iterable<T>, predicate: (item: T, i: number) => TResult): Set<TResult> {
        return new Set<TResult>(select(iterable, predicate));
    }

    export function selectMap<T, TResultKey, TResultValue>(iterable: Iterable<T>, predicate: (item: T, i: number) => [TResultKey, TResultValue]): Map<TResultKey, TResultValue> {
        return new Map<TResultKey, TResultValue>(select(iterable, predicate));
    }

    export function* where<T>(iterable: Iterable<T>, predicate: (value: T, i: number) => boolean): IterableIterator<T> {
        let i = 0;
        for (let v of iterable) {
            if (!predicate(v, i))
                continue;
            yield v;
            i++;
        }
    }
}