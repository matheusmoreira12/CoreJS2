import { TypeDesignator, Constructor } from "../types.js";

export function* resolveCtors(types: Iterable<TypeDesignator>): Iterable<Constructor> {
    for (let type of types) {
        if (type === undefined || type === null || type instanceof Function)
            yield type;
    }
}

export function resolveValueCtor(value: any): Constructor {
    if (value === null || value === undefined)
        return value;
    else
        return value.constructor;
}

export function ctorMatches(ctor: Constructor, sourceCtor: Constructor) {
    while (ctor instanceof Function) {
        const isMatch = ctor === sourceCtor;
        if (isMatch)
            return true;

        ctor = Object.getPrototypeOf(ctor);
    }
    return false;
}

export function ctorMatchesAny(ctor: Constructor, sourceCtors: Iterable<Constructor>) {
    const ctorsAsArray = Array.from(sourceCtors);

    if (ctor === null || ctor === undefined)
        return ctorsAsArray.indexOf(ctor) != -1;
    else {
        const isMatch = ctorsAsArray.some(sc => ctorMatches(ctor, sc));
        return isMatch;
    }
}

export function ctorMatchesAll(ctor: Constructor, sourceCtors: Iterable<Constructor>) {
    const ctorsAsArray = Array.from(sourceCtors);

    if (ctor === null || ctor === undefined)
        return ctorsAsArray.indexOf(ctor) != -1;
    else {
        const isMatch = ctorsAsArray.every(sc => ctorMatches(ctor, sc));
        return isMatch;
    }
}

export function ctorMatchesNone(ctor: Constructor, sourceCtors: Iterable<Constructor>) {
    return !ctorMatchesAny(ctor, sourceCtors);
}