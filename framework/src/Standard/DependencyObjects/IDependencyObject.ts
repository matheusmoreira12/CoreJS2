import { DependencyProperty } from "./DependencyProperty.js";
import { FrameworkEvent } from "../Events/index.js";
import { PropertyChangeEventArgs } from "./PropertyChangeEvent.js";
import { Interface, InterfaceMember } from "../Interfaces/index.js";
import { MemberType } from "../Types/Types.js";
import { Type } from "../Types/Type.js";

export const IDependencyObject = new Interface(
    new InterfaceMember("get", MemberType.Function),
    new InterfaceMember("set", MemberType.Function),
    new InterfaceMember("PropertyChangeEvent", MemberType.Field, Type.get(FrameworkEvent))
);

export interface IDependencyObject {
    get: (property: DependencyProperty) => any;
    set: (property: DependencyProperty, value: any) => void;
    PropertyChangeEvent: FrameworkEvent<PropertyChangeEventArgs>;
}