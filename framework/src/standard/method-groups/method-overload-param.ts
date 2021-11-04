import { TypeConstraint } from "../reflection/type-constraints/index.js";
import { TypeMatchingConstraint } from "../reflection/type.js";

const $acceptedType = Symbol("acceptedType");

export class MethodOverloadParam {
    constructor(accecptedType: TypeMatchingConstraint) {
        this[$acceptedType] = accecptedType;
    }

    private [$acceptedType]: TypeMatchingConstraint;
}
