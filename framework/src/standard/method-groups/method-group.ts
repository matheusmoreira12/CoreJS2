import { Method } from "../reflection/types"
import { InvalidOperationException } from "../exceptions/framework-exception.js";

type TArgs<_TOverides> = any[];
type TResult<_TOverides> = any;
type TThisArg<_TOverides> = any;

function MethodGroup_factory(...overrides: Function[]): Function {
    return function MethodGroup(...args: any[]) {
    }
}

const $overrides = Symbol("overrides");

class MethodGroupBase<TOverrides extends Method[]> extends Function {
    static create<TOverrides extends Method[]>(...overrides: TOverrides): MethodGroupBase<TOverrides> {
        const MethodGroup = MethodGroup_factory(...overrides);
        Object.setPrototypeOf(MethodGroup, new MethodGroupBase());
        return <MethodGroupBase<TOverrides>>MethodGroup;
    }

    constructor(...overrides: TOverrides) {
        super();

        if (new.target == MethodGroup)
            throw new InvalidOperationException("Invalid Constructor.");
        
        this[$overrides] = overrides;
    }

    ["apply"]: (thisArg: TThisArg<TOverrides>, argArray: TArgs<TOverrides>) => TResult<TOverrides>;

    ["call"]: (thisArg: TThisArg<TOverrides>, ...argArray: TArgs<TOverrides>) => TResult<TOverrides>;

    ["bind"]: (thisArg: TThisArg<TOverrides>, argArray: TArgs<TOverrides>) => Method<TArgs<TOverrides>, TResult<TOverrides>, TThisArg<TOverrides>>;

    get overrides(): TOverrides{  return this[$overrides]; }

    private [$overrides]: TOverrides;
}

export abstract class MethodGroup<TOverrides extends Method[]> extends MethodGroupBase<TOverrides> {};