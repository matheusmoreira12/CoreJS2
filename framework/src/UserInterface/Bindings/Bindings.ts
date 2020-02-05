import { Enumeration } from "../../Standard/index";
import { Interface, InterfaceMemberType, InterfaceMember } from "../../Standard/Interfaces/index";
import { Type } from "../../Standard/Types/index";
import { IValueConverter } from "../ValueConverters/index";

export const BindingDirection = Enumeration.create({
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