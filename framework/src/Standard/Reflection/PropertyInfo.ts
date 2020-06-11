import { Type, MemberType } from "./index.js";
import { FieldInfoBase } from "./FieldInfoBase.js";

export class PropertyInfo extends FieldInfoBase {
    constructor(name: string, declaringType: Type, isStatic: boolean = false) {
        super(MemberType.Property, name, declaringType, isStatic);
    }
}