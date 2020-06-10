import { Type, MemberInfo, MemberType } from "./index.js";
import { prot } from "../AccessContexts/index.js";
import { InvalidTypeException } from "../Exceptions/index.js";
import { MemberAttributes } from "./MemberAttributes.js";

export class FieldInfo extends MemberInfo {
    constructor(name: string, declaringType: Type, type: Type, attributes: number) {
        super(MemberType.Field, name);

        if (!(declaringType instanceof Type))
            throw new InvalidTypeException("declaringType");
        if (!(type instanceof Type))
            throw new InvalidTypeException("declaringType");
        if (typeof attributes != "number")
            throw new InvalidTypeException("declaringType");

        MemberAttributes.assertFlag(attributes);

        prot(this, function () {
            this._declaringType = declaringType;
            this._type = type;
            this._attributes = attributes;
        });
    }

    protected _declaringType!: Type;
    protected _type!: Type;
    protected _attributes!: number;

    get declaringType(): Type {
        return prot(this, function () {
            return this._declaringType;
        });
    }

    get type(): Type {
        return prot(this, function () {
            return this._type;
        });
    }

    get attributes(): number {
        return prot(this, function () {
            return this._attributes;
        });
    }
}