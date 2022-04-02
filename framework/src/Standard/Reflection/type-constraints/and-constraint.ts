import { TypeMatchingConstraint } from "../types";
import { TypeConstraint, TypeConstraintType } from "./index.js";

export class AndConstraint extends TypeConstraint {
    constructor(types: TypeMatchingConstraint[]) {
        super(TypeConstraintType.And, types);
    }
}