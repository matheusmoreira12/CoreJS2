import { ParameterInfo, Type } from "./index.js";
import { InvalidTypeException, InvalidOperationException } from "../exceptions/index.js";
import { FieldInfoBase } from "./field-info-base.js";

export class MethodInfoBase extends FieldInfoBase {
    constructor(memberType: number, name: string, declaringType: Type, parameters: ParameterInfo[], isStatic: boolean = false) {
        if (new.target === MethodInfoBase)
            throw new InvalidOperationException("Invalid constructor.");

        super(memberType, name, declaringType, isStatic);

        if (!(parameters instanceof Array))
            throw new InvalidTypeException("parameters");

        this._parameters = parameters;
    }

    protected _parameters: ParameterInfo[];

    get parameters(): ParameterInfo[] {
        return this._parameters;
    }
}