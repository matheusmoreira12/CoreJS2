import { IPropertyOptions } from "./IPropertyOptions";
import { assertParams } from "../../Validation/index";
import { FrameworkEvent } from "../../Standard/Events/index";
import { PropertyChangeEventArgs } from "./PropertyChangeEvent";

import * as Registry from "./Registry";
import * as Storage from "./Storage";

const $label = Symbol();

class PropertyValue {
    [Symbol.toStringTag]() {
        return `PropertyValue(${this[$label]})`;
    }

    constructor(label: string) {
        this[$label] = label;
    }

    private [$label]: any;
}

//Define an arbitrary unset value for the dependency properties
const UNSET_VALUE = new PropertyValue("unset");

const PropertyChangeEvent: FrameworkEvent<PropertyChangeEventArgs> = new FrameworkEvent();

//Keys for DependencyProperty
const $id = Symbol();

/**
 * Eases the integration between user-defined properties and framework features.
 */
export class DependencyProperty {
    static get unsetValue() { return UNSET_VALUE; }

    static register(target: typeof Object, name: string, options: IPropertyOptions): DependencyProperty {
        assertParams({ target }, Function);
        assertParams({ options }, IPropertyOptions);

        const property = new DependencyProperty();
        property[$id] = Registry.register(property);
        return property;
    }

    static getValue(target: object, property: DependencyProperty): any {
        assertParams({ target }, Object);
        assertParams({ property }, DependencyProperty);

        return Storage.getValue(target, property);
    }

    static setValue(target: object, property: DependencyProperty, value: any) {
        assertParams({ target }, Object);
        assertParams({ property }, DependencyProperty);

        return Storage.setValue(target, target, property, value);
    }

    static get ChangeEvent(): FrameworkEvent<PropertyChangeEventArgs> { return PropertyChangeEvent; }

    get id(): number { return this[$id]; }
    private [$id]: number = -1;
}