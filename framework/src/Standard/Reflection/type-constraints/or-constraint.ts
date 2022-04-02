import { TypeMatchingConstraint } from "../types";
import { TypeConstraint, TypeConstraintType } from "./index.js";

export class OrConstraint extends TypeConstraint {
    constructor(types: TypeMatchingConstraint[]) {
        super(TypeConstraintType.Or, types);
    }
}