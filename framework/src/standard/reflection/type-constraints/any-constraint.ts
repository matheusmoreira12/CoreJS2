import { TypeConstraint, TypeConstraintKind } from "./index.js";

export class AnyConstraint extends TypeConstraint {
    constructor() {
        super(TypeConstraintKind.Any, []);
    }
}