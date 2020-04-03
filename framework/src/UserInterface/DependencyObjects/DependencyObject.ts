import { DependencyProperty } from "./DependencyProperty.js";
import { FrameworkEvent } from "../../Standard/Events/index.js";
import { PropertyChangeEventArgs } from "./PropertyChangeEvent.js";
import { assertParams } from "../../Validation/index.js";

import * as Storage from "./Storage.js";

const $PropertyChangeEvent = Symbol("PropertyChangeEvent");

export class DependencyObject {
    constructor() {
        this[$PropertyChangeEvent] = new FrameworkEvent();
    }

    get(property: DependencyProperty): any {
        assertParams({ property }, [DependencyProperty]);

        return Storage.getValue(this, property);
    }

    set(property: DependencyProperty, value: any): void {
        assertParams({ property }, [DependencyProperty]);

        Storage.setValue(this, this, property, value);
    }

    get PropertyChangeEvent(): FrameworkEvent<PropertyChangeEventArgs> { return this[$PropertyChangeEvent]; }
    private [$PropertyChangeEvent]: FrameworkEvent<PropertyChangeEventArgs>;
}