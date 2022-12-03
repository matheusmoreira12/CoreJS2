import { assertParams } from "../../validation/index.js";
import { Interface } from "../interfaces/index.js";
import { Type } from "../reflection/index.js";
import { TypeConstraint } from "../reflection/type-constraints/index.js";
import { TypeMatchingConstraint } from "../reflection/types.js";

export class PropertyMetadata {
    constructor(valueType: TypeMatchingConstraint, defaultValue: any = null) {
        assertParams({ valueType }, [Type, Interface, TypeConstraint]);

        this.#valueType = valueType;
        this.#defaultValue = defaultValue;
    }

    #valueType: TypeMatchingConstraint | null;
    #defaultValue?: any;

    get valueType(): TypeMatchingConstraint | null { return this.#valueType; }
    get defaultValue(): any { return this.#defaultValue; }
}
