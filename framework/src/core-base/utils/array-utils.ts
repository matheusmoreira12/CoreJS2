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

    export function* empty(): IterableIterator<never> {
        return;
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

    export function any<T>(iterable: Iterable<T>, predicate: (item: T) => boolean) : boolean {
        for (let v of iterable) {
            if (predicate(v))
                return true;
        }
        return false;
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

    export function* whereUnique<T, U>(iterable: Iterable<T>, predicate: (item: T) => U): IterableIterator<T> {
        const ub: U[] = [];
        for (let v of iterable) {
            const pr = predicate(v);
            if (ub.includes(pr))
                continue;
            ub.push(pr);
            yield v;
        }
    }

    export function* unique<T>(iterable: Iterable<T>): IterableIterator<T> {
        const ub: T[] = [];
        for (let v of iterable) {
            if (ub.includes(v))
                continue;
            ub.push(v);
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
        let iar, ibr;
        do {
            iar = ia.next();
            ibr = ib.next();
            if (iar.value !== ibr.value)
                break;
        } while (!iar.done && !ibr.done)
        let result = !!iar.done && !!ibr.done;
        if (ia.return)
            ia.return();
        if (ib.return)
            ib.return();
        return result;
    }

    export function aggregate<T, TResult>(iterable: Iterable<T>, predicate: (result: TResult, item: T) => TResult, initial: TResult): TResult {
        const it = iterable[Symbol.iterator]();
        let itr: IteratorResult<T>;
        let r = initial;
        do{
            itr = it.next();
            r = predicate(r, itr.value);
        }
        while (!itr.done)
        if (it.return)
            it.return();
        return r;
    }

    type ZipIterables<Ts> = Ts extends [infer T, ...infer TTail] ? [Iterable<T>, ZipIterables<TTail>] : [Ts];

    export function* zip<Ts extends any[]>(...iterables: ZipIterables<Ts>): IterableIterator<[...Ts]> {
        const is = iterables.map(i => i[Symbol.iterator]());
        while (true) {
            let q = false;
            const vs: Ts = new Array() as Ts;
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
            yield vs;
        }
    }
}