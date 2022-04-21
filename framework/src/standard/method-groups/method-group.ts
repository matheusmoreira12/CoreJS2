import { Method } from "../reflection/types"
import { InvalidOperationException } from "../exceptions/framework-exception.js";

type Args<TOverloads extends Method<any[], any, any>[]> = Parameters<TOverloads[number]>;
type Result<TOverloads extends Method<any[], any, any>[]> = ReturnType<TOverloads[number]>;
type ThisArg<TOverloads extends Method<any[], any, any>[]> = ThisParameterType<TOverloads[number]>;

const $overloads = Symbol("overloads");

interface MethodGroupBase<TOverloads extends Method<any[], any, any>[]> extends Function, Method<Args<TOverloads>, Result<TOverloads>, ThisArg<TOverloads>>{}

class MethodGroupBase<TOverloads extends Method<any[], any, any>[]> extends Function {
    static create<TOverloads extends Method<any[], any, any>[]>(...overloads: TOverloads): MethodGroupBase<TOverloads> {
        const MethodGroup = MethodGroupBody_factory(...overloads);
        Object.setPrototypeOf(MethodGroup, new MethodGroupBase());
        return <MethodGroupBase<TOverloads>>MethodGroup;
    }

    constructor(...overloads: TOverloads) {
        super();

        if (new.target == MethodGroup)
            throw new InvalidOperationException("Invalid Constructor.");
        
        this[$overloads] = overloads;
    }

    ["apply"]: (thisArg: ThisArg<TOverloads>, argArray: Args<TOverloads>) => Result<TOverloads>;

    ["call"]: (thisArg: ThisArg<TOverloads>, ...argArray: Args<TOverloads>) => Result<TOverloads>;

    ["bind"]: (thisArg: ThisArg<TOverloads>, argArray: Args<TOverloads>) => Method<Args<TOverloads>, Result<TOverloads>, ThisArg<TOverloads>>;

    get overloads(): TOverloads{ return this[$overloads]; }

    private [$overloads]: TOverloads;
}

function MethodGroupBody_factory(...overloads: Function[]): Function {
    return function MethodGroupBody(...args: any[]) {
        for (let overload of overloads) {
            let arguments = overload.arguments;
        }
    }
}

export abstract class MethodGroup<TOverloads extends Method<any[], any, any>[]> extends MethodGroupBase<TOverloads> {};