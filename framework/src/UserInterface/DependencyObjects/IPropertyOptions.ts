import { Type, MemberAttributes } from "../../Standard/Types/index";
import { Interface, InterfaceMember, InterfaceMemberType } from "../../Standard/Interfaces/index";

export const IPropertyOptions = new Interface(
    new InterfaceMember("valueType", InterfaceMemberType.Field, Type.get(Type), MemberAttributes.Enumerable, true),
    new InterfaceMember("defaultValue", InterfaceMemberType.Field, null, MemberAttributes.Enumerable, true)
);

export interface IPropertyOptions {
    valueType: Type | Interface | null;
    defaultValue: any;
}
