import { Enumeration } from "../../Standard/index.js";
import { Interface, InterfaceField } from "../../Standard/Interfaces/index.js";
import { Type } from "../../Standard/Reflection/index.js";
import { IValueConverter } from "../ValueConverters/index.js";

export const BindingDirection = Enumeration.create({
    ToTarget: 1,
    ToSource: 2,
    Both: 3
});

export const IBindingOptions = new Interface(
    new InterfaceField("direction", Type.get(Number)),
    new InterfaceField("valueConverter", IValueConverter),
);

export interface IBindingOptions {
    direction?: number,
    valueConverter?: IValueConverter
};