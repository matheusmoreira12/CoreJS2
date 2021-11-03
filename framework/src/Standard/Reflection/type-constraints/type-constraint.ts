import { assertEachParams } from "../../../validation/index.js";
import { InvalidOperationException } from "../../exceptions/index.js";
import { Enumeration } from "../../index.js";
import { Interface } from "../../interfaces/index.js";
import { Type, TypeMatchingConstraint } from "../index.js"

export const TypeConstraintType = Enumeration.create({
    Or: 0,
    And: null
});

export abstract class TypeConstraint {
    constructor(type: number, baseTypes: TypeMatchingConstraint[]) {
        if (new.target === TypeConstraint)
            throw new InvalidOperationException("Invalid Constructor.");

        assertEachParams({ baseTypes }, [Type, Interface, TypeConstraint]);

        this.__type = type;
        this.__baseTypes = baseTypes;
    }

    protected __type: number;
    protected __baseTypes: TypeMatchingConstraint[];

    get type(): number { return this.__type; }
    get baseTypes(): TypeMatchingConstraint[] { return this.__baseTypes; }
}