import { TypeMatchingConstraint } from "../index.js";
import { TypeConstraint, TypeConstraintType } from "./index.js";

export class AndConstraint extends TypeConstraint {
    constructor(types: TypeMatchingConstraint[]) {
        super(TypeConstraintType.And, types);
    }
}