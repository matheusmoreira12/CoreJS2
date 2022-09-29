import { assertParams } from "../../validation/index.js";
import { Type } from "../reflection/index.js";
import { TypeConstraint } from "../reflection/type-constraints/index.js";
import { TypeMatchingConstraint } from "../reflection/types.js";

export class PropertyMetadata {
    constructor(valueType: TypeMatchingConstraint | null, defaultValue: any = null) {
        assertParams({ valueType }, [Type, TypeConstraint, null]);

        this.__valueType = valueType;
        this.__defaultValue = defaultValue;
    }

    private __valueType: TypeMatchingConstraint | null;
    private __defaultValue?: any;

    get valueType(): TypeMatchingConstraint | null { return this.__valueType; }
    get defaultValue(): any { return this.__defaultValue; }
}
