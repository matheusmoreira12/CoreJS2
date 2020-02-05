import { Type } from "../Standard/Types/Type";
import { InvalidOperationException, ArgumentTypeException } from "../Standard/index";
import { Interface } from "../Standard/Interfaces/index";

type Class = new() => any;
type TypeDesignator = undefined | null | Type | Interface | Class;

export function assertParameter(parameterName: string, value: any, ...types: TypeDesignator[]) {
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

    const valueType = Type.of(value);
    if (!valueType.matchesAny(...resolveTypes()))
        throw new ArgumentTypeException(parameterName, valueType, types.length === 0 ? types[0] : types);
}