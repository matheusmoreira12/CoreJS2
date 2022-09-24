import { CompareSelectPredicate } from "./compare-select-predicate";

export namespace ArrayUtils {
    export function* compareSelect<T, U, TResult>(a: Iterable<T>, b: Iterable<U>, predicate: CompareSelectPredicate<T, U, TResult>) {
        const ia = a[Symbol.iterator](), ib = b[Symbol.iterator]();
        let iar, ibr;
        let i = 0;
        do {
            iar = ia.next();
            ibr = ib.next();
            let q = false, s = false;
            let pr = predicate(iar.value, iar.value, i, () => q = true, () => s = true);
            if (q)
                break;
            if (s)
                continue;
            yield pr;
            i++;
        } while (!iar.done && !ibr.done);
    }

    export function getFirst<T>(iterable: Iterable<T>): T | undefined {
        const it = iterable[Symbol.iterator]();
        if (!it)
            throw new Error('Invalid type for argument "iterable". An iterable or iterator was expected.');
        const ir = it.next();
        if (it.return)
            it.return();
        return ir.value;
    }

    export function getLast<T>(iterable: Iterable<T>): T | undefined {
        const it = iterable[Symbol.iterator]();
        if (!it)
            throw new Error('Invalid type for argument "iterable". An iterable or iterator was expected.');
        if (it.next) {
            let ir;
            do
                ir = it.next();
            while (!ir.done);
            if (it.return)
                it.return();
            return ir.value;
        }
    }

    export function* exclude<T>(iterable: Iterable<T>, exclude: T): IterableIterator<T> {
        for (let v of iterable) {
            if (v == exclude)
                continue;
            yield v;
        }
    }

    export function* excludeMany<T>(iterable: Iterable<T>, exclude: Iterable<T>): IterableIterator<T> {
        let r = iterable;
        for (let ev of exclude)
            r = ArrayUtils.exclude(r, ev);
        yield* r;
    }
}