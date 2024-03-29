import { Destructible } from "../index.js";
import { FrameworkEvent } from "../events/index.js";
import { DependencyProperty, DependencyPropertyKey, PropertyChangeEventArgs } from "./index.js";
import { __Storage } from "./__storage.js";
import { InvalidOperationException } from "../exceptions/index.js";
import { OutputArgument } from "../reflection/types";
import { IdentifierGenerator } from "../../core-base/index.js";
import { assertParams } from "../../validation-standalone/index.js";

const idGen = new IdentifierGenerator();

export abstract class DependencyObject extends Destructible {
    constructor() {
        super();

        this.__PropertyChangeEvent = new FrameworkEvent(this.__onPropertyChange, this);
        this.__id = idGen.generate();
    }

    protected __onPropertyChange(_sender: any, _args: PropertyChangeEventArgs): void { }

    get(property: DependencyProperty): any {
        assertParams({ property }, [DependencyProperty]);

        const tryGetValueOutput: OutputArgument<any> = {};
        if (__Storage.tryGetValue(this, property, tryGetValueOutput))
            return tryGetValueOutput.value!;
        throw new InvalidOperationException("Cannot get value.");
    }

    set(propertyOrPropertyKey: DependencyProperty | DependencyPropertyKey, value: any): void {
        assertParams({ property: propertyOrPropertyKey }, [DependencyProperty, DependencyPropertyKey]);

        if (__Storage.trySetValue(this, this, propertyOrPropertyKey, value))
            return;
        throw new InvalidOperationException("Cannot set value. Property is readonly or the value type is incorrect.");
    }

    get PropertyChangeEvent(): FrameworkEvent<PropertyChangeEventArgs> { return this.__PropertyChangeEvent; }
    private __PropertyChangeEvent: FrameworkEvent<PropertyChangeEventArgs>;

    get id(): bigint { return this.__id; }
    private __id: bigint;
}