import { FrameworkEventArgs, FrameworkEvent } from "../../Standard/Events/index";
import { DependencyProperty } from "./index";
import { ArgumentMissingException, ArgumentTypeException } from "../../Standard/index";

export type PropertyChangeEvent = FrameworkEvent<PropertyChangeEventArgs>;

/**
 * PropertyChangeEventArgs class
 * Arguments for the PropertyChangeEvent event.
 */
export class PropertyChangeEventArgs extends FrameworkEventArgs {
    constructor(target: object, property: DependencyProperty, oldValue: any, newValue: any) {
        if (arguments.length < 3)
            throw new ArgumentMissingException("oldValue");
        if (arguments.length < 4)
            throw new ArgumentMissingException("newValue");
        if (!(target instanceof Object))
            throw new ArgumentTypeException("target", target, Object);
        if (!(property instanceof DependencyProperty))
            throw new ArgumentTypeException("property", property, DependencyProperty);

        super();

        this.__target = target;
        this.__property = property;
        this.__oldValue = oldValue;
        this.__newValue = newValue;
    }

    get target(): object { return this.__target; }
    private __target: object;

    get property(): DependencyProperty { return this.__property; }
    private __property: DependencyProperty;

    get oldValue(): any { return this.__oldValue; }
    private __oldValue: any;

    get newValue(): any { return this.__newValue; }
    private __newValue: any;
}