import { Type } from "../Types/index";
import { Interface } from "../Interfaces/index";
import { assertParams } from "../../Validation/index";

export class PropertyMetadata {
    constructor(valueType: Type | Interface | null, defaultValue: any) {
        assertParams({ valueType }, Type, Interface, null);
        assertParams({ defaultValue }, valueType);

        this.__valueType = valueType;
        this.__defaultValue = defaultValue;
    }

    get valueType(): Type | Interface | null { return this.__valueType; }
    private __valueType: Type | Interface | null;

    get defaultValue(): any { return this.__defaultValue; }
    private __defaultValue: any;
}
