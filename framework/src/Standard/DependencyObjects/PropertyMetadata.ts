import { Type } from "../Types/index";
import { Interface } from "../Interfaces/index";
import { assertParameter } from "../../Validation/index";

export class PropertyMetadata {
    constructor(valueType: Type | Interface | null, defaultValue: any) {
        assertParameter("valueType", valueType, Type, Interface, null);
        assertParameter("defaultValue", defaultValue, valueType);

        this.__valueType = valueType;
        this.__defaultValue = defaultValue;
    }

    get valueType(): Type | Interface | null { return this.__valueType; }
    private __valueType: Type | Interface | null;

    get defaultValue(): any { return this.__defaultValue; }
    private __defaultValue: any;
}
