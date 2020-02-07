import { DependencyProperty } from "./DependencyProperty";
import { FrameworkEvent } from "../Events/index";
import { PropertyChangeEventArgs } from "./PropertyChangeEvent";
import * as Registry from "./Registry";

export class DependencyObject {
    get(property: DependencyProperty): any {
        Registry.getValue(property, this);
    }

    set(property: DependencyProperty, value: any) {
        Registry.setValue(property, this, value);
    }

    protected __onPropertyChange(sender: any, args: PropertyChangeEventArgs) { }

    __invoke_onPropertyChange(args: PropertyChangeEventArgs) {
        this.PropertyChangeEvent.invoke(this, args);
    }

    PropertyChangeEvent: FrameworkEvent<PropertyChangeEventArgs> = new FrameworkEvent(this.__onPropertyChange, this);
}