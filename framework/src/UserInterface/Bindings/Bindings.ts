import { Enumeration } from "../../Standard/index.js";
import { Interface, InterfaceMemberType, InterfaceMember } from "../../Standard/Interfaces/index.js";
import { Type } from "../../Standard/Reflection/index.js";
import { IValueConverter } from "../ValueConverters/index.js";

export const BindingDirection = Enumeration.create({
    ToTarget: 1,
    ToSource: 2,
    Both: 3
});

export const IBindingOptions = new Interface(
    new InterfaceMember("direction", InterfaceMemberType.Field, Type.get(Number), true),
    new InterfaceMember("valueConverter", InterfaceMemberType.Field, IValueConverter, true),
);

export interface IBindingOptions {
    direction?: number,
    valueConverter?: IValueConverter
};