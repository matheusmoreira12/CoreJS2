import { TypeDesignator } from "../Types.js";
import { resolveValueCtor, resolveCtors } from "./CtorUtils.js";

function treatValueString(valueStr: string){
    valueStr = valueStr.replace(/[\n\t]/, " ");
    valueStr = valueStr.replace("\r", "");
    if (valueStr.length > 20)
        return valueStr.slice(0, 19) + "...";
    else
        return valueStr;
}

export function getValueString(value: any) {
    const receivedValueCtor = resolveValueCtor(value);
    if (receivedValueCtor === undefined || receivedValueCtor === null)
        return `(none)(${treatValueString(String(value))})`;
    else
        return `${receivedValueCtor.name}(${String(value)})`;
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