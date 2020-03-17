import { CompareSelectPredicate } from "./index";

export namespace ArrayUtils {
    export function* compareSelect<T, U, TResult>(a: T[], b: U[], predicate: CompareSelectPredicate<T, U, TResult>) {
        let length = a.length;
        if (b.length > length)
            length = b.length;

        for (let i = 0; i < length; i++) {
            let isQuitting = false,
                isSkipping = false;

            let x = predicate(a[i], b[i], () => isQuitting = true, () => isSkipping = true);

            if (isQuitting)
                break;
            if (isSkipping)
                continue;

            yield x;
        }
    }

    export function getFirst<T>(iterable: IterableIterator<T>): T | undefined {
        if (iterable.next) {
            const v = iterable.next().value;

            if (iterable.return)
                iterable.return();

            return v;
        }
        else if (iterable[Symbol.iterator])
            return getFirst(iterable[Symbol.iterator]());
        else
            throw new Error('Invalid type for argument "iterable". An iterable or iterator was expected.');
    }

    export function getLast<T>(iterable: IterableIterator<T>): T | undefined {
        if (iterable.next) {
            let r, v = undefined;
            do {
                if (r)
                    v = r.value;
                r = iterable.next();
            }
            while (!r.done);

            if (iterable.return)
                iterable.return();

            return v;
        }
        else if (iterable[Symbol.iterator])
            return getLast(iterable[Symbol.iterator]());
        else
            throw new Error('Invalid type for argument "iterable". An iterable or iterator was expected.');
    }
}