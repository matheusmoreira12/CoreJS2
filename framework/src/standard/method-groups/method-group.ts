import { Method } from "../reflection/types"

type TArgs<_TOverides> = any[];
type TResult<_TOverides> = any;
type TThisArg<_TOverides> = any;

function MethodGroup_factory<TOverrides extends Method[]>(...overrides: TOverrides): MethodGroupBase<TOverrides> {
    return function MethodGroup() {
    }
}

class MethodGroupBase<TOverrides extends Method[]> extends Function {
    static create<TOverrides extends Method[]>(...overrides: TOverrides): MethodGroupBase<TOverrides> {
        const MethodGroup = MethodGroup_factory(...overrides);
        Object.setPrototypeOf(MethodGroup, new MethodGroupBase());
        return MethodGroup;
    }

    ["apply"]: (thisArg: TThisArg<TOverrides>, argArray: TArgs<TOverrides>) => TResult<TOverrides>;

    ["call"]: (thisArg: TThisArg<TOverrides>, ...argArray: TArgs<TOverrides>) => TResult<TOverrides>;

    ["bind"]: (thisArg: TThisArg<TOverrides>, argArray: TArgs<TOverrides>) => Method<TArgs<TOverrides>, TResult<TOverrides>, TThisArg<TOverrides>>;
}

export const MethodGroup = MethodGroupBase;