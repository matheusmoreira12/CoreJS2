import { TypeDesignator, AssertionMode } from "./types.js";
import { tryAssert, rejectAssert } from "./utils/assertion-utils.js";

export function assert(map: { [name: string]: any }, types: Iterable<TypeDesignator>, mode: AssertionMode = "any") {
    if (!tryAssert(map, [Object]))
        rejectAssert([Object], map);
    if (!tryAssert(types, [Array]))
        rejectAssert([Array], types);
    if (!tryAssert(mode, [String]))
        rejectAssert([String], mode);

    for (let name of Object.getOwnPropertyNames(map)) {
        const value = map[name];
        if (!tryAssert(value, types))
            rejectAssert(Array.from(types), value, mode);
    }
}

export function assertParams(parameterMap: { [name: string]: any }, types: Iterable<TypeDesignator>, mode: AssertionMode = "any") {
    if (!tryAssert(parameterMap, [Object]))
        rejectAssert([Object], parameterMap);
    if (!tryAssert(types, [Array]))
        rejectAssert([Array], types);
    if (!tryAssert(mode, [String]))
        rejectAssert([String], mode);

    for (let parameterName of Object.getOwnPropertyNames(parameterMap)) {
        const parameterValue = parameterMap[parameterName];
        if (!tryAssert(parameterValue, types, mode))
            rejectAssert(Array.from(types), parameterValue);
    }
}