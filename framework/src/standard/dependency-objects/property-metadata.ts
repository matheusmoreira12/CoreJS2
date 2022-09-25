import { assertParams } from "../../validation/index.js";
import { Interface } from "../interfaces/interface.js";
import { Type } from "../reflection/index.js";
import { TypeConstraint } from "../reflection/type-constraints/index.js";
import { TypeMatchingConstraint } from "../reflection/types";
import { ValueType } from "./types";

export class PropertyMetadata {
    constructor(valueType: ValueType, defaultValue: any = null) {
        assertParams({ valueType }, [Type, Interface, TypeConstraint, null]);

        this.__valueType = valueType;
        this.__defaultValue = defaultValue;
    }

    private __valueType: ValueType;
    private __defaultValue?: any;

    get valueType(): ValueType { return this.__valueType; }
    get defaultValue(): any { return this.__defaultValue; }
}
