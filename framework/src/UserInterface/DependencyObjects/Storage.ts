import { DependencyProperty } from "./DependencyProperty";
import { DependencyObject } from "./DependencyObject";
import { PropertyChangeEventArgs } from "./PropertyChangeEvent";

const setters: InternalSetter[] = [];

type InternalSetter = {
    source: object,
    target: object,
    property: DependencyProperty,
    value: any
};

namespace InternalSetter {
    export function create(source: object, target: DependencyObject, property: DependencyProperty, value: any): InternalSetter {
        return {
            source,
            target,
            property,
            value
        }
    }
}

function notifyValueChange(target: DependencyObject, property: DependencyProperty, oldValue: any, newValue: any) {
    target.PropertyChangeEvent.invoke(target, new PropertyChangeEventArgs(target, property, oldValue, newValue));
}

export function setValue(source: object, target: DependencyObject, property: DependencyProperty, value: any) {
    const oldValue = getValue(target, property);
    if (oldValue !== value)
        notifyValueChange(target, property, oldValue, value);

    if (value === null)
        unsetValue(source, target, property);
    else {
        let setter = setters.find(s => s.source === source && s.target === target && s.property === property)
        if (setter)
            setter.value = value;
        else {
            setter = InternalSetter.create(source, target, property, value);
            setters.push(setter);
        }
    }
}

export function unsetValue(source: object, target: DependencyObject, property: DependencyProperty) {
    let index = setters.findIndex(s => s.source === source && s.target === target && s.property === property);
    if (index != -1)
        setters.splice(index, 1);
}

export function getValue(target: DependencyObject, property: DependencyProperty): any {
    let setter = setters.reverse().find(s => s.target === target && s.property === property && s.value !== null);
    if (setter)
        return setter.value;
    else
        return null;
}