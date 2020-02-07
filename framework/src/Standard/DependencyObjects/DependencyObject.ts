import { DependencyProperty } from "./DependencyProperty";
import { FrameworkEvent } from "../Events/index";
import { PropertyChangeEventArgs } from "./PropertyChangeEvent";

export class DependencyObject {
    get(property: DependencyProperty) {
    }

    set(property: DependencyProperty, value: any) {
    }

    __onPropertyChange(sender: any, args: PropertyChangeEventArgs) { }

    PropertyChangeEvent: FrameworkEvent<PropertyChangeEventArgs> = new FrameworkEvent(this.__onPropertyChange, this);
}