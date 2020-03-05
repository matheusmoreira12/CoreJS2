import { DependencyProperty } from "./DependencyProperty";
import { FrameworkEvent } from "../../Standard/Events/index";
import { PropertyChangeEventArgs } from "./PropertyChangeEvent";
import { assertParams } from "../../Validation/index";

import * as Storage from "./Storage";

const $PropertyChangeEvent = Symbol();

export class DependencyObject {
    constructor() {
        this[$PropertyChangeEvent] = new FrameworkEvent();
    }

    get(property: DependencyProperty): any {
        assertParams({ property }, DependencyProperty);

        return Storage.getValue(this, property);
    }

    set(property: DependencyProperty, value: any): void {
        assertParams({ property }, DependencyProperty);

        Storage.setValue(this, this, property, value);
    }

    get PropertyChangeEvent(): FrameworkEvent<PropertyChangeEventArgs> { return this[$PropertyChangeEvent]; }
    private [$PropertyChangeEvent]: FrameworkEvent<PropertyChangeEventArgs>;
}