import { assertEachParams } from "../../../Validation/index.js";
import { InvalidOperationException } from "../../Exceptions/index.js";
import { Enumeration } from "../../index.js";
import { Interface } from "../../Interfaces/index.js";
import { Type } from "../index.js";

export type TypeConstraintBaseType = Type | Interface | TypeConstraint;

export const TypeConstraintType = Enumeration.create({
    Or: 0,
    And: null
});

export abstract class TypeConstraint {
    constructor(type: number, baseTypes: TypeConstraintBaseType[]) {
        if (new.target === TypeConstraint)
            throw new InvalidOperationException("Invalid Constructor.");

        assertEachParams({ baseTypes }, [Type, Interface, TypeConstraint]);

        this.__type = type;
        this.__baseTypes = baseTypes;
    }

    protected __type: number;
    protected __baseTypes: TypeConstraintBaseType[];

    get type(): number { return this.__type; }
    get baseTypes(): TypeConstraintBaseType[] { return this.__baseTypes; }
}