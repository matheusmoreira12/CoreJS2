import { TypeConstraint } from "./index.js";
import { TypeConstraintBaseType, TypeConstraintType } from "./type-constraint.js";

export class OrConstraint extends TypeConstraint {
    constructor(types: TypeConstraintBaseType[]) {
        super(TypeConstraintType.Or, types);
    }
}