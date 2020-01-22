import { Type } from "../../Standard/Types/index.js";
import { Interface } from "../../Standard/Interfaces/index.js";
import { PropertyChangeEvent, PropertyChangeEventArgs } from "./DependencyPropertyChangeEvent.js";
export declare class FrameworkPropertyOptions {
    constructor(valueType: Type | Interface | null, defaultValue: any);
    get valueType(): Type | Interface | null;
    private __valueType;
    get defaultValue(): any;
    private __defaultValue;
}
/**
 * FrameworkProperty class
 * Eases the integration between user-defined properties and framework features.
 */
export declare class FrameworkProperty {
    constructor(name: string, options: FrameworkPropertyOptions);
    get(target: object): any;
    set(target: object, value: any): void;
    get ChangeEvent(): PropertyChangeEvent;
    private __ChangeEvent;
    __invokeOnChange(args: PropertyChangeEventArgs): void;
    get name(): string;
    private __name;
    get options(): FrameworkPropertyOptions;
    private __options;
    private __storedValues;
}
