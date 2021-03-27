import { Destructible } from "../index.js";
import { DependencyProperty } from "./dependency-property.js";
import { FrameworkEvent } from "../events/index.js";
import { PropertyChangeEventArgs } from "./property-change-event.js";
import { assertParams } from "../../validation/index.js";

import * as Storage from "./_storage.js";

export abstract class DependencyObject extends Destructible {
    constructor() {
        super();

        this.__PropertyChangeEvent = new FrameworkEvent(this.__onPropertyChange, this);
    }

    protected __onPropertyChange(sender: any, args: PropertyChangeEventArgs): void { }

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

    protected destructor() {
        this.__PropertyChangeEvent.destruct();
    }
}