import { Type } from "../Standard/Types/Type.js";
import { Interface } from "../Standard/Interfaces/index.js";
import { TypeDesignator } from "./Types.js";
import { NotSupportedException, ArgumentTypeException, InvalidTypeException, FrameworkException } from "../Standard/index.js";
import { TypeValidationMode } from "./TypeValidationMode.js";

function* resolveTypes(typeDesignators: Iterable<TypeDesignator>): Iterable<Type | Interface> {
    for (let type of typeDesignators) {
        if (type === undefined || type === null)
            yield Type.of(type);
        else if (type instanceof Type || type instanceof Interface)
            yield type;
        else if (type instanceof Function)
            yield Type.get(type);
        else
            throw new NotSupportedException("The specified type designator is not supported.");
    }
}

function tryAssert(value: any, typeDesignators: Iterable<TypeDesignator>, validationMode: number = TypeValidationMode.MatchAny): boolean {
    TypeValidationMode.assertFlag(validationMode);

    const valueType = Type.of(value);
    const types = resolveTypes(typeDesignators);
    switch (validationMode) {
        case TypeValidationMode.MatchAny:
            return valueType.matchesAny(...types);
        case TypeValidationMode.MatchAll:
            return valueType.matchesAll(...types);
        case TypeValidationMode.MatchNone:
            return !valueType.matchesAny(...types);
    }
    return false;
}

export function assert(map: object, typeDesignators: Iterable<TypeDesignator>, validationMode: number = TypeValidationMode.MatchAny) {
    for (let key in map) {
        const value: any = map[<keyof typeof map>key];
        if (!tryAssert(value, typeDesignators, validationMode))
            throw new ArgumentTypeException(key, value, [...typeDesignators]);
    }
}

export function assertParams(parameterMap: object, typeDesignators: Iterable<TypeDesignator>, validationMode: number = TypeValidationMode.MatchAny) {
    for (let key in parameterMap) {
        const value: any = parameterMap[<keyof typeof parameterMap>key];
        if (!tryAssert(value, typeDesignators, validationMode))
            throw new ArgumentTypeException(key, value, [...typeDesignators]);
    }
}

function assertCollection(collectionName: string, collection: any[], itemTypes: Iterable<TypeDesignator>, itemValidationMode: number = TypeValidationMode.MatchAny, collectionTypes: Iterable<TypeDesignator> = [], collectionValidationMode: number = TypeValidationMode.MatchAny, collectionExceptionCtor: new (...args: any[]) => FrameworkException, itemExceptionCtor: new (...args: any[]) => FrameworkException) {
    if (!tryAssert(collection, collectionTypes, collectionValidationMode))
        throw new collectionExceptionCtor(collectionName, collection, [...collectionTypes]);

    for (let i = 0; i < collection.length; i++) {
        const item = collection[i];
        if (!tryAssert(item, itemTypes, itemValidationMode))
            throw new itemExceptionCtor(`${collectionName}[${i}]`);
    }
}

export function assertEach(map: { [collectionName: string]: any[] }, itemTypes: Iterable<TypeDesignator>, itemValidationMode: number, collectionTypes: Iterable<TypeDesignator>, collectionValidationMode: number) {
    for (let name in map) {
        const collection = map[name];
        assertCollection(name, collection, itemTypes, itemValidationMode, collectionTypes, collectionValidationMode, InvalidTypeException, InvalidTypeException);
    }
}

export function assertEachParams(parametersMap: { [collectionName: string]: any[] }, parameterItemTypes: Iterable<TypeDesignator>, parameterItemValidationMode: number = TypeValidationMode.MatchAny, parameterTypes: Iterable<TypeDesignator> = [], parameterValidationMode: number = TypeValidationMode.MatchAny) {
    for (let name in parametersMap) {
        const collection = parametersMap[name];
        assertCollection(name, collection, parameterItemTypes, parameterItemValidationMode, parameterTypes, parameterValidationMode, ArgumentTypeException, ArgumentTypeException);
    }
}