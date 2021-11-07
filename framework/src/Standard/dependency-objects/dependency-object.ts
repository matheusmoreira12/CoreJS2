import { JSTypeFromValueType, MetadataFromProperty, ValueTypeFromMetadata } from "./types";
import { Destructible } from "../index.js";
import { FrameworkEvent } from "../events/index.js";
import { assertParams } from "../../validation/index.js";
import { DependencyProperty, DependencyPropertyKey, PropertyChangeEventArgs } from "./index.js";

import { _Storage } from "./_storage.js";

export abstract class DependencyObject extends Destructible {
    constructor() {
        super();

        this.__PropertyChangeEvent = new FrameworkEvent(this.__onPropertyChange, this);
    }

    protected __onPropertyChange(sender: any, args: PropertyChangeEventArgs): void { }

    get<TProperty extends DependencyProperty>(property: TProperty): JSTypeFromValueType<ValueTypeFromMetadata<MetadataFromProperty<TProperty>>>;
    get(property: DependencyProperty): any {
        assertParams({ property }, [DependencyProperty]);

        return _Storage.getValue(this, property);
    }

    set<TProperty extends DependencyProperty>(property: TProperty, value: JSTypeFromValueType<ValueTypeFromMetadata<MetadataFromProperty<TProperty>>>): void;
    set<TProperty extends DependencyProperty>(propertyKey: DependencyPropertyKey<TProperty>, value: JSTypeFromValueType<ValueTypeFromMetadata<MetadataFromProperty<TProperty>>>): void;
    set(propertyOrPropertyKey: DependencyProperty | DependencyPropertyKey, value: any): void {
        assertParams({ property: propertyOrPropertyKey }, [DependencyProperty, DependencyPropertyKey]);

        _Storage.setValue(this, this, propertyOrPropertyKey, value);
    }

    get PropertyChangeEvent(): FrameworkEvent<PropertyChangeEventArgs> { return this.__PropertyChangeEvent; }
    private __PropertyChangeEvent: FrameworkEvent<PropertyChangeEventArgs>;

    protected destructor() {
        this.__PropertyChangeEvent.destruct();
    }
}