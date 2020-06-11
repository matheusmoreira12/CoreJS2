import { Type } from "../Reflection/index.js";
import { Interface, InterfaceMember, InterfaceMemberType } from "../Interfaces/index.js";

export const IPropertyMetadata = new Interface(
    new InterfaceMember("valueType", InterfaceMemberType.Field, null, true),
    new InterfaceMember("defaultValue", InterfaceMemberType.Field, null, true)
);

export interface IPropertyMetadata {
    valueType?: Type | Interface;
    defaultValue?: any;
}
