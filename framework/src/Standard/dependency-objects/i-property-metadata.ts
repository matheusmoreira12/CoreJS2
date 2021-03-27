import { Interface, InterfaceField } from "../interfaces/index.js";
import { Type } from "../reflection/index.js";

export const IPropertyMetadata = new Interface(
    new InterfaceField("valueType", Type.of(null)),
    new InterfaceField("defaultValue", Type.of(null))
);

export interface IPropertyMetadata {
    valueType?: Type | Interface;
    defaultValue?: any;
}
