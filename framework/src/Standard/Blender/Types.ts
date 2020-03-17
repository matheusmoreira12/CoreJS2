export type ExecutePredicate<TBlend extends Object, TResult, TThis = never> = (this: TThis, blend: TBlend) => TResult;