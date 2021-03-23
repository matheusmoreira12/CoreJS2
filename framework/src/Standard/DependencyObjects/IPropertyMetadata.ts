import { Interface, InterfaceField } from "../Interfaces/index.js";
import { Type, Attributes } from "../Reflection/index.js";

export const IPropertyMetadata = new Interface(
    new InterfaceField("valueType", null),
    new InterfaceField("defaultValue", null)
);

export interface IPropertyMetadata {
    valueType?: Type | Interface;
    defaultValue?: any;
}
