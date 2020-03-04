import { DependencyProperty } from "./DependencyProperty";

const setters: InternalSetter[] = [];

type InternalSetter = {
    source: object,
    target: object,
    property: DependencyProperty,
    value: any
};

namespace InternalSetter {
    export function create(source: object, target: object, property: DependencyProperty, value: any): InternalSetter {
        return {
            source,
            target,
            property,
            value
        }
    }
}

export function setValue(source: object, target: object, property: DependencyProperty, value: any) {
    if (value === DependencyProperty.unsetValue)
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

export function unsetValue(source: object, target: object, property: DependencyProperty) {
    let index = setters.findIndex(s => s.source === source && s.target === target && s.property === property);
    if (index != -1)
        setters.splice(index, 1);
}

export function getValue(target: object, property: DependencyProperty): any {
    let setter = setters.reverse().find(s => s.target === target && s.property === property && s.value !== DependencyProperty.unsetValue);
    if (setter)
        return setter.value;
    else
        return DependencyProperty.unsetValue;
}