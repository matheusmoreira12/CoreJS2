import { MemberInfo, MemberType, Type } from "./index.js";

export class ParameterInfo extends MemberInfo {
    constructor(name: string, type: Type) {
        super(MemberType.Parameter, name)

        this._type = type;
    }

    protected _type: Type;

    get type(): Type { return this._type; }
}