export type CompareSelectPredicate<T, U, TResult> = (a: T, b: U, i: number, quit: () => void, skip: () => void) => TResult;
