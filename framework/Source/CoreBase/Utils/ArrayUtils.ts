export type CompareSelectPredicate<T, U, TResult> = (a: T, b: U, quit: () => void, skip: () => void) => TResult;

const ArrayUtils = {
    * compareSelect<T, U, TResult>(a: T[], b: U[], predicate: CompareSelectPredicate<T, U, TResult>) {
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
};

export default ArrayUtils;