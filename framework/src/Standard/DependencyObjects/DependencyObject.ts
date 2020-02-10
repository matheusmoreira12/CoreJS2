import { DependencyProperty } from "./DependencyProperty";
import { FrameworkEvent } from "../Events/index";
import { PropertyChangeEventArgs } from "./PropertyChangeEvent";

export class DependencyObject extends Object {
    get(property: DependencyProperty): any {
    }

    set(property: DependencyProperty, value: any) {
    }

    protected __onPropertyChange(sender: any, args: PropertyChangeEventArgs) { }

    __invoke_onPropertyChange(args: PropertyChangeEventArgs) {
        this.PropertyChangeEvent.invoke(this, args);
    }

    PropertyChangeEvent: FrameworkEvent<PropertyChangeEventArgs> = new FrameworkEvent(this.__onPropertyChange, this);
}