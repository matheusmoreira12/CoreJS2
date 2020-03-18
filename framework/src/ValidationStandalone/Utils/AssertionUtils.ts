import { resolveValueCtor, resolveCtors, ctorMatchesAny, ctorMatchesAll, ctorMatchesNone } from "./CtorUtils";
import { TypeDesignator, AssertionMode } from "../Types";
import { getTypeDesigatorArrayString, getValueString } from "./StringUtils";

export function tryAssert(value: any, types: Iterable<TypeDesignator>, mode: AssertionMode = "any"): boolean {
    const ctor = resolveValueCtor(value);
    const ctors = resolveCtors(types);

    if (mode == "any")
        return ctorMatchesAny(ctor, ctors);
    else if (mode == "all")
        return ctorMatchesAll(ctor, ctors);
    else if (mode == "none")
        return ctorMatchesNone(ctor, ctors);
    else
        return false;
}

export function rejectAssert(expectedTypes: TypeDesignator[], rejectedValue: any, mode: AssertionMode = "any") {
    throw new Error(`Assert: Invalid value type. A type of ${getValueString(rejectedValue)} was expected to match type ${getTypeDesigatorArrayString(expectedTypes)} with a mode of [${mode}].`);
}