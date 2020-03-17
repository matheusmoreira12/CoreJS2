import { DependencyProperty } from "./DependencyProperty";
import { DependencyObject } from "./DependencyObject";
import { PropertyChangeEventArgs } from "./PropertyChangeEvent";

import * as Registry from "./Registry";

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

function notifyValueChange(source: object, target: DependencyObject, property: DependencyProperty, oldValue: any, newValue: any) {
    const args = new PropertyChangeEventArgs(target, property, oldValue, newValue);
    target.PropertyChangeEvent.invoke(source, args);
}

export function internal_unsetValue(source: object, target: DependencyObject, property: DependencyProperty) {
    let index = setters.findIndex(s => s.source === source && s.target === target && s.property === property);
    if (index != -1)
        setters.splice(index, 1);
}

export function internal_setValue(source: object, target: DependencyObject, property: DependencyProperty, value: any) {
    if (value !== null) {
        const newSetter = InternalSetter.create(source, target, property, value);
        setters.push(newSetter);
    }
}

export function setValue(source: object, target: DependencyObject, property: DependencyProperty, value: any) {
    const oldValue = getValue(target, property);
    internal_unsetValue(source, target, property);
    if (value !== null)
        internal_setValue(source, target, property, value);
    const newValue = getValue(target, property);
    const hasValueChanged = oldValue !== newValue;
    if (hasValueChanged)
        notifyValueChange(source, target, property, oldValue, newValue);
}

export function getRawValue(target: DependencyObject, property: DependencyProperty): any {
    for (let setter of setters) {
        if (setter.target === target &&
            setter.property === property &&
            setter.value !== null)
            return setter.value;
    }
    return null;
}

export function getValue(target: DependencyObject, property: DependencyProperty): any {
    const options = Registry.getOptions(property);
    const rawValue = getRawValue(target, property);
    if (rawValue === null) {
        if (options)
            return options.defaultValue;
        else
            return null;
    }
    else
        return rawValue;
}