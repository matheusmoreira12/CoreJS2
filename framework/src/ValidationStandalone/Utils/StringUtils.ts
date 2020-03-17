import { TypeDesignator } from "../Types";
import { resolveValueCtor, resolveCtors } from "./CtorUtils";

export function getValueString(value: any) {
    const receivedValueCtor = resolveValueCtor(value);
    if (receivedValueCtor === undefined || receivedValueCtor === null)
        return `(none)(${String(value)})`;
    else
        return `${receivedValueCtor.name}(${String()})`;
}

export function getTypeDesigatorArrayString(types: TypeDesignator[]) {
    const expectedTypeCtors = Array.from(resolveCtors(types));
    if (expectedTypeCtors.length == 0)
        return "(none)";
    else if (expectedTypeCtors.length == 1)
        return expectedTypeCtors[0].name;
    else {
        const expectedTypeCtorsStr = `[${expectedTypeCtors.map(etc => etc.name).join(", ")}]`;
        return expectedTypeCtorsStr;
    }
}