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

function notifyValueChange(target: DependencyObject, property: DependencyProperty, oldValue: any, newValue: any) {
    target.PropertyChangeEvent.invoke(target, new PropertyChangeEventArgs(target, property, oldValue, newValue));
}

export function setValue(source: object, target: DependencyObject, property: DependencyProperty, value: any) {
    if (value === null)
        unsetValue(source, target, property);
    else {
        const oldRawValue = getRawValue(target, property);

        const oldSetter = setters.find(s => s.source === source && s.target === target && s.property === property);
        const hasSetter = !!oldSetter;
        if (hasSetter)
            setters.splice(setters.indexOf(<InternalSetter>oldSetter), 1);

        const newSetter = InternalSetter.create(source, target, property, value);
        setters.push(newSetter);

        const hasValueChanged = oldRawValue !== value;
        if (hasValueChanged)
            notifyValueChange(target, property, oldRawValue, value);
    }
}

export function unsetValue(source: object, target: DependencyObject, property: DependencyProperty) {
    let index = setters.findIndex(s => s.source === source && s.target === target && s.property === property);
    if (index != -1)
        setters.splice(index, 1);
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