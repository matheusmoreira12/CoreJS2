import { Destructible } from "../../Standard/index.js";
import { DependencyProperty } from "./DependencyProperty.js";
import { FrameworkEvent } from "../../Standard/Events/index.js";
import { PropertyChangeEventArgs } from "./PropertyChangeEvent.js";
import { assertParams } from "../../Validation/index.js";

import * as Storage from "./Storage.js";


export class DependencyObject extends Destructible {
    constructor() {
        super();

        this.__PropertyChangeEvent = new FrameworkEvent();
    }

    get(property: DependencyProperty): any {
        assertParams({ property }, [DependencyProperty]);

        return Storage.getValue(this, property);
    }

    set(property: DependencyProperty, value: any): void {
        assertParams({ property }, [DependencyProperty]);

        Storage.setValue(this, this, property, value);
    }

    get PropertyChangeEvent(): FrameworkEvent<PropertyChangeEventArgs> { return this.__PropertyChangeEvent; }
    private __PropertyChangeEvent: FrameworkEvent<PropertyChangeEventArgs>;

    destructor() {
        this.__PropertyChangeEvent.destruct();
    }
}