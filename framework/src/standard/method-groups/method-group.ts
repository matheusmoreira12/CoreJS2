import { Method } from "../reflection/types"
import { InvalidOperationException } from "../exceptions/framework-exception.js";

type Args<TOverrides extends Method<any[], any, any>[]> = Parameters<TOverrides[number]>;
type Result<TOverrides extends Method<any[], any, any>[]> = ReturnType<TOverrides[number]>;
type ThisArg<TOverrides extends Method<any[], any, any>[]> = ThisParameterType<TOverrides[number]>;

function MethodGroup_factory(...overrides: Function[]): Function {
    return function MethodGroup(...args: any[]) {
    }
}

const $overrides = Symbol("overrides");

interface MethodGroupBase<TOverrides extends Method<any[], any, any>[]> extends Function, Method<Args<TOverrides>, Result<TOverrides>, ThisArg<TOverrides>>{}

class MethodGroupBase<TOverrides extends Method<any[], any, any>[]> extends Function {
    static create<TOverrides extends Method<any[], any, any>[]>(...overrides: TOverrides): MethodGroupBase<TOverrides> {
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

    ["apply"]: (thisArg: ThisArg<TOverrides>, argArray: Args<TOverrides>) => Result<TOverrides>;

    ["call"]: (thisArg: ThisArg<TOverrides>, ...argArray: Args<TOverrides>) => Result<TOverrides>;

    ["bind"]: (thisArg: ThisArg<TOverrides>, argArray: Args<TOverrides>) => Method<Args<TOverrides>, Result<TOverrides>, ThisArg<TOverrides>>;

    get overrides(): TOverrides{  return this[$overrides]; }

    private [$overrides]: TOverrides;
}

export abstract class MethodGroup<TOverrides extends Method<any[], any, any>[]> extends MethodGroupBase<TOverrides> {};