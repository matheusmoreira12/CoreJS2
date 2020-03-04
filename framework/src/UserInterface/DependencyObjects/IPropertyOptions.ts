import { Type } from "../../Standard/Types/index";
import { Interface, InterfaceMember, InterfaceMemberType } from "../../Standard/Interfaces/index";

export const IPropertyOptions = new Interface(
    new InterfaceMember("propertyName", InterfaceMemberType.Field, Type.get(String)),
    new InterfaceMember("valueType", InterfaceMemberType.Field, Type.get(Type)),
    new InterfaceMember("defaultValue", InterfaceMemberType.Field)
);

export interface IPropertyOptions {
    propertyName: string;
    valueType: Type | Interface | null;
    defaultValue: any;
}
