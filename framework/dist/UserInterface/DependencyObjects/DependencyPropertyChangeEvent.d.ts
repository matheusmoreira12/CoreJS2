import { FrameworkEventArgs, FrameworkEvent } from "../../Standard/Events/index.js";
import { FrameworkProperty } from "./index.js";
export declare type PropertyChangeEvent = FrameworkEvent<PropertyChangeEventArgs>;
/**
 * PropertyChangeEventArgs class
 * Arguments for the PropertyChangeEvent event.
 */
export declare class PropertyChangeEventArgs extends FrameworkEventArgs {
    constructor(target: object, property: FrameworkProperty, oldValue: any, newValue: any);
    get target(): object;
    private __target;
    get property(): FrameworkProperty;
    private __property;
    get oldValue(): any;
    private __oldValue;
    get newValue(): any;
    private __newValue;
}
