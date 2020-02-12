import { Type } from "../../Standard/Types/index";
import { Interface } from "../../Standard/Interfaces/index";
import { assertParams } from "../../Validation/index";
import { DependencyProperty } from "./DependencyProperty";

function assertDefaultValue(valueType: Type | Interface | null, defaultValue: any) {
    if (defaultValue !== DependencyProperty.unsetValue)
        assertParams({ defaultValue }, valueType);
}

export class PropertyMetadata {
    constructor(valueType: Type | Interface | null, defaultValue: any = DependencyProperty.unsetValue) {
        assertParams({ valueType }, Type, Interface, null);
        assertDefaultValue(valueType, defaultValue);

        this.__valueType = valueType;
        this.__defaultValue = defaultValue;
    }

    get valueType(): Type | Interface | null { return this.__valueType; }
    private __valueType: Type | Interface | null;

    get defaultValue(): any { return this.__defaultValue; }
    private __defaultValue: any;
}
