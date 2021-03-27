import { DependencyProperty } from "./dependency-property.js";
import { FrameworkEvent } from "../events/index.js";
import { PropertyChangeEventArgs } from "./property-change-event.js";
import { Interface, InterfaceField, InterfaceFunction } from "../interfaces/index.js";
import { Type } from "../reflection/type.js";

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