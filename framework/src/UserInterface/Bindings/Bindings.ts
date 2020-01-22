import { Enumeration } from "../../Standard/index.js";
import { Interface, InterfaceMemberType, InterfaceMember } from "../../Standard/Interfaces/index.js";
import { Type } from "../../Standard/Types/index.js";
import { IValueConverter } from "../ValueConverters/index.js";

export const BindingDirection = new Enumeration({
    Both: 3,
    ToTarget: 1,
    ToSource: 2
});

export const IBindingOptions = new Interface(
    new InterfaceMember("direction", InterfaceMemberType.Property, Type.get(Number), undefined, true),
    new InterfaceMember("valueConverter", InterfaceMemberType.Property, IValueConverter, undefined, true),
);

export interface IBindingOptions {
    direction?: number,
    valueConverter?: IValueConverter
};