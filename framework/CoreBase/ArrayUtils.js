export const ArrayUtils = {
    * compareSelect(a, b, predicate) {
        let length = a.length;
        if (b.length > length)
            length = b.length;

        for (let i = 0; i < length; i++) {
            let isQuitting = false,
                isSkipping = false;

            let x = predicate(a[i], b[i], {
                quit: () => isQuitting = true,
                skip: () => isSkipping = true
            });

            if (isQuitting)
                break;
            if (isSkipping)
                continue;

            yield x;
        }
    }
};