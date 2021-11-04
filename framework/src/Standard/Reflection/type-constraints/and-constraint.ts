import { TypeMatchingConstraint } from "../index.js";
import { TypeConstraint } from "./index.js";
import { TypeConstraintType } from "./type-constraint.js";

export class AndConstraint extends TypeConstraint {
    constructor(types: TypeMatchingConstraint[]) {
        super(TypeConstraintType.And, types);
    }
}