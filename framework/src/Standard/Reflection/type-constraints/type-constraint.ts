import { assertEachParams } from "../../../validation/index.js";
import { InvalidOperationException } from "../../exceptions/index.js";
import { Interface } from "../../interfaces/index.js";
import { Type } from "../index.js"
import { TypeMatchingConstraint } from "../types";

export abstract class TypeConstraint<TBase extends TypeMatchingConstraint[] = any[]> {
    constructor(type: number, baseTypes: TBase) {
        if (new.target === TypeConstraint)
            throw new InvalidOperationException("Invalid Constructor.");

        assertEachParams({ baseTypes }, [Type, Interface, TypeConstraint]);

        this.__type = type;
        this.__baseTypes = baseTypes;
    }

    protected __type: number;
    protected __baseTypes: TBase;

    get type(): number { return this.__type; }
    get baseTypes(): TBase { return this.__baseTypes; }
}