import { ParameterInfo, Type } from "./index.js";
import { InvalidTypeException, InvalidOperationException } from "../Exceptions/index.js";
import { FieldInfoBase } from "./FieldInfoBase.js";

export class FunctionInfoBase extends FieldInfoBase {
    constructor(memberType: number, name: string, declaringType: Type, parameters: ParameterInfo[], isStatic: boolean = false) {
        if (new.target === FunctionInfoBase)
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