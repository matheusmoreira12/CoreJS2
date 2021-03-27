import { TypeConstraint } from "./index.js";
import { TypeConstraintBaseType, TypeConstraintType } from "./type-constraint.js";

export class AndConstraint extends TypeConstraint {
    constructor(types: TypeConstraintBaseType[]) {
        super(TypeConstraintType.And, types);
    }
}