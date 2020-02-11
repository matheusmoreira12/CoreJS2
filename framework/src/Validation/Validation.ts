import { Type } from "../Standard/Types/index";
import { InvalidOperationException, ArgumentTypeException } from "../Standard/index";
import { Interface } from "../Standard/Interfaces/index";

type TypeDesignator = undefined | null | Type | Interface | Function;

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

export function assertParams(parameterMap: { [parameterName: string]: any }, ...types: TypeDesignator[]) {
    if (!tryAssert(parameterMap, Object))
        throw new ArgumentTypeException("parameterMap", parameterMap, Object);

    for (let parameterName in parameterMap) {
        const parameterValue = parameterMap[parameterName];
        if (!tryAssert(parameterValue, ...types))
            throw new ArgumentTypeException(parameterName, Type.of(parameterValue), types.length == 0 ? types[0] : types)
    }
}

export function assert(map: { [name: string]: any }, ...types: TypeDesignator[]) {
    if (!tryAssert(map, Object))
        throw new ArgumentTypeException("map", map, Object);

    for (let name in map) {
        const value = map[name];
        if (!tryAssert(value, ...types))
            throw new ArgumentTypeException(name, Type.of(value), types.length == 0 ? types[0] : types)
    }
}