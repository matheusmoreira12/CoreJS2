import { DependencyProperty } from "./DependencyProperty";
import { FrameworkEvent } from "../../Standard/Events/index";
import { PropertyChangeEventArgs } from "./PropertyChangeEvent";
import { Interface, InterfaceMember } from "../../Standard/Interfaces/index";
import { MemberType } from "../../Standard/Types/Types";
import { Type } from "../../Standard/Types/Type";

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