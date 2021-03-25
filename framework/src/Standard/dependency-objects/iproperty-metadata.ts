import { Interface, InterfaceField } from "../Interfaces/index.js";
import { Type } from "../Reflection/index.js";

export const IPropertyMetadata = new Interface(
    new InterfaceField("valueType", Type.of(null)),
    new InterfaceField("defaultValue", Type.of(null))
);

export interface IPropertyMetadata {
    valueType?: Type | Interface;
    defaultValue?: any;
}
