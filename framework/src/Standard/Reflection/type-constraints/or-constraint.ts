import { TypeMatchingConstraint } from "../index.js";
import { TypeConstraint, TypeConstraintType } from "./index.js";

export class OrConstraint extends TypeConstraint {
    constructor(types: TypeMatchingConstraint[]) {
        super(TypeConstraintType.Or, types);
    }
}