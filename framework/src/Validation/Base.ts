import { Class } from "../Standard/Types/index";
import { InvalidOperationException, ArgumentTypeException, InvalidTypeException } from "../Standard/index";

function* resolveConstructors(...types: TypeDesignator[]): Iterable<Constructor> {
    for (let type of types) {
        if (type === undefined || type === null || type instanceof Function)
            yield type;
    }
}

function getConstructor(value: any): Constructor {
    if (value === null || value === undefined)
        return value;
    else
        return value.constructor;
}

function constructorMatchesAny(ctor: Constructor, ...ctors: Constructor[]) {
    if (ctor === null || ctor === undefined)
        while (ctor instanceof Function) {
            const isMatch = ctors.indexOf(ctor) !== -1;
            if (isMatch)
                return true;

            ctor = Object.getPrototypeOf(ctor);
        }

    return false;
}

function tryAssert(value: any, ...types: TypeDesignator[]): boolean {
    const ctor = getConstructor(value);
    const ctors = resolveConstructors(...types);
    return constructorMatchesAny(ctor, ...ctors);
}

export function assert(map: { [name: string]: any }, ...types: TypeDesignator[]) {
    if (!tryAssert(map, Object))
        throw new ArgumentTypeException("map", map, Object);

    for (let name in map) {
        const value = map[name];
        if (!tryAssert(value, ...types))
            throw new ArgumentTypeException(name, value, types.length == 0 ? types[0] : types)
    }
}

export function assertParams(parameterMap: { [parameterName: string]: any }, ...types: TypeDesignator[]) {
    if (!tryAssert(parameterMap, Object))
        throw new ArgumentTypeException("parameterMap", parameterMap, Object);

    for (let parameterName in parameterMap) {
        const parameterValue = parameterMap[parameterName];
        if (!tryAssert(parameterValue, ...types))
            throw new ArgumentTypeException(parameterName, parameterValue, types.length == 0 ? types[0] : types)
    }
}

export function assertEach(map: { [collectionName: string]: any[] }, collectionType: TypeDesignator, ...types: TypeDesignator[]) {
    for (let name in map) {
        const collection = map[name];
        if (!tryAssert(collection, collectionType))
            throw new InvalidTypeException(name, collection, collectionType);

        for (let i = 0; i < collection.length; i++) {
            const item = collection[i];
            if (!tryAssert(item, ...types))
                throw new InvalidTypeException(`${name}[${i}]`, item, types.length == 0 ? types[0] : types);
        }
    }
}

export function assertEachParams(map: { [collectionName: string]: any[] }, collectionType: TypeDesignator, ...types: TypeDesignator[]) {
    for (let name in map) {
        const collection = map[name];
        if (!tryAssert(collection, collectionType))
            throw new ArgumentTypeException(name, collection, collectionType);

        for (let i = 0; i < collection.length; i++) {
            const item = collection[i];
            if (!tryAssert(item, ...types))
                throw new ArgumentTypeException(`${name}[${i}]`, item, types.length == 0 ? types[0] : types);
        }
    }
}