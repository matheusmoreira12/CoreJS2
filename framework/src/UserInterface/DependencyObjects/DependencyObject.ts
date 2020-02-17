import { DependencyProperty } from "./DependencyProperty";
import { FrameworkEvent } from "../../Standard/Events/index";
import { PropertyChangeEventArgs } from "./PropertyChangeEvent";
import { DataContext } from "../DataContexts/index";
import { InvalidOperationException, InvalidTypeException } from "../../Standard/index";
import { assertParams } from "../../Validation/index";
import * as Storage from "./Storage/DependencyDataContext";

export class DependencyObject {
    get(property: DependencyProperty): any {
        assertParams({ property }, DependencyProperty);

        return getPropertyValue(this, property);
    }

    set(property: DependencyProperty, value: any) {
        assertParams({ property }, DependencyProperty);

        setPropertyValue(this, property, value);
    }

    protected __onPropertyChange(sender: any, args: PropertyChangeEventArgs) { }

    __invoke_onPropertyChange(args: PropertyChangeEventArgs) {
        this.PropertyChangeEvent.invoke(this, args);
    }

    PropertyChangeEvent: FrameworkEvent<PropertyChangeEventArgs> = new FrameworkEvent(this.__onPropertyChange, this);
}

function getPropertyValue(target: DependencyObject, property: DependencyProperty) {
    const context = DataContext.main.find(c => c.target === target);
    if (context === undefined)
        throw new InvalidOperationException("Cannot get property value. No overridden data context has been found.")
    else;
}

function setPropertyValue(target: DependencyObject, property: DependencyProperty, value: any): any {
    const context = DataContext.main.find(c => c.target === target);
    if (context === undefined)
        throw new InvalidOperationException("Cannot set property value. No overridden data context has been found.")
    else;
}