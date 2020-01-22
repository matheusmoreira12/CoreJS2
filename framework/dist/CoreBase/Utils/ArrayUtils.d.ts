import { CompareSelectPredicate } from "./index.js";
export declare function compareSelect<T, U, TResult>(a: T[], b: U[], predicate: CompareSelectPredicate<T, U, TResult>): Generator<TResult, void, unknown>;
