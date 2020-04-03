import { Type, MemberAttributes } from "../../Standard/Types/index.js";
import { Interface, InterfaceMember, InterfaceMemberType } from "../../Standard/Interfaces/index.js";

export const IPropertyOptions = new Interface(
    new InterfaceMember("valueType", InterfaceMemberType.Field, null, MemberAttributes.Enumerable, true),
    new InterfaceMember("defaultValue", InterfaceMemberType.Field, null, MemberAttributes.Enumerable, true)
);

export interface IPropertyOptions {
    valueType?: Type | Interface;
    defaultValue?: any;
}
