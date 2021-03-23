import { Enumeration } from "../../Standard/index.js";
import { Interface, InterfaceMemberType, InterfaceMember } from "../../Standard/Interfaces/index.js";
import { Type, MemberAttributes as Attributes } from "../../Standard/Reflection/index.js";
import { IValueConverter } from "../ValueConverters/index.js";

export const BindingDirection = Enumeration.create({
    ToTarget: 1,
    ToSource: 2,
    Both: 3
});

export const IBindingOptions = new Interface(
    new InterfaceMember("direction", InterfaceMemberType.Field, Type.get(Number), Attributes.Enumerable, true),
    new InterfaceMember("valueConverter", InterfaceMemberType.Field, IValueConverter, Attributes.Enumerable, true),
);

export interface IBindingOptions {
    direction?: number,
    valueConverter?: IValueConverter
};