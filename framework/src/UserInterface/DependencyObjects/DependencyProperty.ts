import { IPropertyOptions } from "./IPropertyOptions";
import { assertParams } from "../../Validation/index";
import { FrameworkEvent } from "../../Standard/Events/index";
import { PropertyChangeEventArgs } from "./PropertyChangeEvent";

import * as Registry from "./Registry";
import * as Storage from "./Storage";

const PropertyChangeEvent: FrameworkEvent<PropertyChangeEventArgs> = new FrameworkEvent();

//Keys for DependencyProperty
const $name = Symbol();

/**
 * Eases the integration between user-defined properties and framework features.
 */
export class DependencyProperty {
    static register(target: typeof Object, name: string, options: IPropertyOptions): DependencyProperty {
        assertParams({ target }, Function);
        assertParams({ options }, IPropertyOptions);

        const property = new DependencyProperty(name);
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

    constructor(name: string) {
        assertParams({ name }, String);

        this[$name] = name;
    }

    get name(): string { return this[$name]; }
    private [$name]: string;
}