import { TypeMatchingConstraint } from "../types";
import { TypeConstraint, TypeConstraintKind } from "./index.js";

export class OrConstraint<TBase extends TypeMatchingConstraint[]> extends TypeConstraint<TBase> {
    constructor(types: TBase) {
        super(TypeConstraintKind.Or, types);
    }
}