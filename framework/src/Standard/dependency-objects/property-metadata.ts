import { ValueType } from "./types";

import { assertParams } from "../../validation/index.js";
import { Interface } from "../interfaces/interface.js";
import { Type, TypeMatchingConstraint } from "../reflection/index.js";
import { TypeConstraint } from "../reflection/type-constraints/index.js";

export class PropertyMetadata<TValue extends ValueType = any> {
    constructor(valueType: TValue, defaultValue: any = null) {
        assertParams({ valueType }, [Type, Interface, TypeConstraint, null]);

        this.__valueType = valueType;
        this.__defaultValue = defaultValue;
    }

    private __valueType: ValueType;
    private __defaultValue?: any;

    get valueType(): ValueType { return this.__valueType; }
    get defaultValue(): any { return this.__defaultValue; }
}
