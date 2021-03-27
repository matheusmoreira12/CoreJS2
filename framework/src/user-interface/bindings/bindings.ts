import { Enumeration } from "../../standard/index.js";
import { Interface, InterfaceField } from "../../standard/interfaces/index.js";
import { Type } from "../../standard/reflection/index.js";
import { IValueConverter } from "../value-converters/index.js";

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