import { Type } from "../Standard/Types/Type";
import { InvalidOperationException, ArgumentTypeException, InvalidTypeException } from "../Standard/index";
import { Interface } from "../Standard/Interfaces/index";

type Class = new () => any;
type TypeDesignator = undefined | null | Type | Interface | Class;

function tryAssert(value: any, ...types: TypeDesignator[]): boolean {
    function* resolveTypes(): Generator<Type | Interface> {
        for (let type of types) {
            if (type === undefined || type === null)
                yield Type.of(type);
            else if (type instanceof Type || type instanceof Interface)
                yield type;
            else if (<any>type instanceof Function)
                yield Type.get(type);
            else
                throw new InvalidOperationException(`Could not assert parameter type. ${type} is not a valid type constraint.`);
        }
    }

    return Type.of(value).matchesAny(...resolveTypes());
}

export function assertParameter(parameterName: string, value: any, ...types: TypeDesignator[]) {
    if (!tryAssert(parameterName, Array))
        throw new ArgumentTypeException("parameterName", parameterName, String);
    if (!tryAssert(types, Array))
        throw new ArgumentTypeException("types", types, Array);

    if (!tryAssert(value, ...types))
        throw new ArgumentTypeException(parameterName, value, types.length === 0 ? types[0] : types);
}

export function assert(name: string, value: any, ...types: TypeDesignator[]) {
    if (!tryAssert(name, Array))
        throw new ArgumentTypeException("parameterName", name, String);
    if (!tryAssert(types, Array))
        throw new ArgumentTypeException("types", types, Array);

    if (!tryAssert(value, ...types))
        throw new InvalidTypeException(name, value, types.length === 0 ? types[0] : types);
}