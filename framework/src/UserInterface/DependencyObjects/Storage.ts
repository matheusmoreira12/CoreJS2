import { DependencyProperty } from "./DependencyProperty";

export function setValue(source: object, target: object, property: DependencyProperty, value: any) {
    if (value === DependencyProperty.unsetValue)
        unsetValue(source, target, property);
    else {
        
    }
}

export function unsetValue(source: object, target: object, property: DependencyProperty) {

}

export function getValue(target: object, property: DependencyProperty): any {

}