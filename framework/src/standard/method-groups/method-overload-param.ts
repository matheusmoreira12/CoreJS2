import { TypeMatchingConstraint } from "../reflection/index.js";

const $acceptedType = Symbol("acceptedType");

export class MethodOverloadParam {
    constructor(accecptedType: TypeMatchingConstraint) {
        this[$acceptedType] = accecptedType;
    }

    get acceptedType(): TypeMatchingConstraint { return this[$acceptedType]; }

    private [$acceptedType]: TypeMatchingConstraint;
}
