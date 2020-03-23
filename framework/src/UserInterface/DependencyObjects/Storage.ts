import { DependencyProperty } from "./DependencyProperty";
import { DependencyObject } from "./DependencyObject";
import { PropertyChangeEventArgs } from "./PropertyChangeEvent";
import { Collection } from "../../Standard/Collections/index";

import * as Registry from "./Registry";

const setters: Collection<InternalSetter> = new Collection();

type InternalSetter = {
    source: object,
    target: DependencyObject,
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
    let setter = setters.findLast(s => s.source === source && s.target === target && s.property === property);
    if (setter)
        setters.remove(setter);
}

export function internal_setValue(source: object, target: DependencyObject, property: DependencyProperty, value: any) {
    const newSetter = InternalSetter.create(source, target, property, value);
    setters.push(newSetter);
}

export function setValue(source: object, target: DependencyObject, property: DependencyProperty, value: any) {
    const oldRawValue = getRawValue(target, property);
    internal_unsetValue(source, target, property);
    if (value !== null)
        internal_setValue(source, target, property, value);
    const newRawValue = getRawValue(target, property);
    const hasValueChanged = oldRawValue !== newRawValue;
    if (hasValueChanged)
        notifyValueChange(source, target, property, oldRawValue, newRawValue);
}

export function getRawValue(target: DependencyObject, property: DependencyProperty): any {
    const setter = setters.findLast(s => s.target === target && s.property === property && s.value !== null);
    if (setter)
        return setter.value
    else
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