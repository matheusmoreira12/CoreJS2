import { Binding, IBindingOptions } from "./index.js";
import { FrameworkProperty, PropertyChangeEventArgs } from "../DependencyObjects/index.js";
/**
 * PropertyBinding class
 * Allows the binding of two framework properties.
 */
export declare class PropertyBinding extends Binding {
    constructor(source: object, sourceProperty: FrameworkProperty, target: object, targetProperty: FrameworkProperty, options?: IBindingOptions);
    updateTargetProperty(value: any): void;
    sourceProperty_onChange(sender: any, args: PropertyChangeEventArgs): void;
    updateSourceProperty(value: any): void;
    targetProperty_onChange(sender: any, args: PropertyChangeEventArgs): void;
    get source(): object;
    private __source;
    get sourceProperty(): FrameworkProperty;
    private __sourceProperty;
    get target(): object;
    private __target;
    get targetProperty(): FrameworkProperty;
    private __targetProperty;
    destructor(): void;
}
