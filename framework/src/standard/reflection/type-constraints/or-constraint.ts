import { TypeMatchingConstraint } from "../types";
import { TypeConstraint, TypeConstraintType } from "./index.js";

export class OrConstraint<TBase extends TypeMatchingConstraint[]> extends TypeConstraint<TBase> {
    constructor(types: TBase) {
        super(TypeConstraintType.Or, types);
    }
}