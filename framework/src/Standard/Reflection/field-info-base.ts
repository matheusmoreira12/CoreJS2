import { MemberInfo, Type } from "./index.js";
import { ArgumentTypeException, InvalidOperationException } from "../Exceptions/index.js";

export class FieldInfoBase extends MemberInfo {
    constructor(memberType: number, name: string, declaringType: Type, isStatic: boolean = false) {
        if (new.target === FieldInfoBase)
            throw new InvalidOperationException("Invalid constructor.");

        super(memberType, name);

        if (!(declaringType instanceof Type))
            throw new ArgumentTypeException("declaringType");
        if (typeof isStatic != "boolean")
            throw new ArgumentTypeException("isStatic");

        this._declaringType = declaringType;
        this._isStatic = isStatic;
    }

    protected _declaringType: Type;

    protected _isStatic: boolean;

    get declaringType(): Type {
        return this._declaringType;
    }

    get isStatic(): boolean {
        return this._isStatic;
    }
}