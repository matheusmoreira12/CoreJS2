import { DependencyProperty } from "./DependencyProperty";
import { FrameworkEvent } from "../../Standard/Events/index";
import { PropertyChangeEventArgs } from "./PropertyChangeEvent";

export class DependencyObject {
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