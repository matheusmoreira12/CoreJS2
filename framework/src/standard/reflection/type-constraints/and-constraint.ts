import { TypeMatchingConstraint } from "../types";
import { TypeConstraint, TypeConstraintKind } from "./index.js";

export class AndConstraint<TBase extends TypeMatchingConstraint[]> extends TypeConstraint<TBase> {
    constructor(types: TBase) {
        super(TypeConstraintKind.And, types);
    }
}