import { Trigger } from "./index.js";
import { FrameworkProperty } from "../DependencyObjects/index.js";
import { Collection } from "../../Standard/Collections/index.js";
import { Setter } from "../Setters/index.js";
/**
 * PropertyTrigger class
 * Triggers a group of setters when the specified property matches the specified value.
 */
export declare class PropertyTrigger extends Trigger {
    constructor(target: object, targetProperty: FrameworkProperty, value: any, ...setters: Setter[]);
    private __targetProperty_onChange;
    get target(): object;
    private __target;
    get targetProperty(): FrameworkProperty;
    private __targetProperty;
    get value(): any;
    private __value;
    get setters(): Collection<Setter>;
    private __setters;
}
