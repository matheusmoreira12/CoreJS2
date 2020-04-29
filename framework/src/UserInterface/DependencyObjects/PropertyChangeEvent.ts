import { FrameworkEventArgs } from "../../Standard/Events/index.js";
import { DependencyProperty } from "./index.js";
import { ArgumentTypeException } from "../../Standard/Exceptions/index.js"

/**
 * PropertyChangeEventArgs class
 * Arguments for the PropertyChangeEvent event.
 */
export class PropertyChangeEventArgs extends FrameworkEventArgs {
    constructor(target: object, property: DependencyProperty, oldValue: any, newValue: any) {
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