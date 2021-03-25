import { DependencyProperty } from "./DependencyProperty.js";
import { FrameworkEvent } from "../Events/index.js";
import { PropertyChangeEventArgs } from "./PropertyChangeEvent.js";
import { Interface, InterfaceField, InterfaceFunction } from "../Interfaces/index.js";
import { Type } from "../Reflection/Type.js";

export const IDependencyObject = new Interface(
    new InterfaceFunction("get"),
    new InterfaceFunction("set"),
    new InterfaceField("PropertyChangeEvent", Type.get(FrameworkEvent))
);

export interface IDependencyObject {
    get: (property: DependencyProperty) => any;
    set: (property: DependencyProperty, value: any) => void;
    PropertyChangeEvent: FrameworkEvent<PropertyChangeEventArgs>;
}