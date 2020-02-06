import { FrameworkEvent } from "../Events/index";
import { PropertyChangeEvent, PropertyChangeEventArgs } from "./DependencyPropertyChangeEvent";
import { PropertyMetadata } from "./PropertyMetadata";
import * as Registry from "./DependencyPropertyRegistry";
import { DependencyObject } from "./DependencyObject";

type Class<T> = new() => T;

/**
 * Eases the integration between user-defined properties and framework features.
 */
export class DependencyProperty {
    static register(target: Class<DependencyObject>, name: string, metadata: PropertyMetadata) {
        const property = new DependencyProperty(name, metadata);
        Registry.register(target, property);
        return property;
    }

    constructor(name: string, options: PropertyMetadata) {
        this.__name = name;
        this.__metadata = options;
    }

    get(target: object) {
        const options = this.__metadata;
        const storedValues = this.__storedValues;
        if (!storedValues.has(target))
            return options.defaultValue;

        return storedValues.get(target);
    }

    set(target: object, value: any) {
        const oldValue = this.get(target);

        const storedValues = this.__storedValues;
        storedValues.set(target, value);

        if (value !== oldValue)
            this.__invokeOnChange(new PropertyChangeEventArgs(target, this, oldValue, value));
    }

    get ChangeEvent(): PropertyChangeEvent { return this.__ChangeEvent; }
    private __ChangeEvent: PropertyChangeEvent = new FrameworkEvent();

    __invokeOnChange(args: PropertyChangeEventArgs) {
        this.ChangeEvent.invoke(this, args);
    }

    get name(): string { return this.__name; }
    private __name: string;

    get metadata(): PropertyMetadata { return this.__metadata; }
    private __metadata: PropertyMetadata;

    private __storedValues = new WeakMap<object, any>();
}