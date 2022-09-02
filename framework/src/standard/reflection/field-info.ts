import { FieldInfoBase } from "./field-info-base.js";
import { Type, MemberType } from "./index.js";
import { InvalidTypeException } from "../exceptions/index.js";

export class FieldInfo extends FieldInfoBase {
    constructor(name: string, declaringType: Type, type: Type, isStatic: boolean = false) {
        super(MemberType.Field, name, declaringType, isStatic);

        if (!(type instanceof Type))
            throw new InvalidTypeException("type");

        this._type = type;
    }

    protected _type!: Type;

    get type(): Type {
        return this._type;
    }
}