import { Enumeration } from "../Standard/Enumeration";
import { Interface } from "../Standard/Interfaces/Interface";
import { ValueConverter } from "../Standard/Standard";
import { FrameworkProperty } from "./user-interface";
import { Destructible } from "../Standard/Destructible";
export declare const BindingDirection: Enumeration<number>;
export declare const IBindingOptions: Interface;
export interface BindingOptions {
    direction?: number;
    valueConverter?: ValueConverter;
}
/**
 * Binding base class
 *
 */
export declare abstract class Binding extends Destructible {
    constructor(options?: BindingOptions);
    get options(): BindingOptions;
    protected __options: BindingOptions;
}
/**
 * PropertyBinding class
 * Allows the binding of two framework properties.
 */
export declare class PropertyBinding extends Binding {
    constructor(source: object, sourceProperty: FrameworkProperty, target: object, targetProperty: FrameworkProperty, options?: BindingOptions);
    updateTargetProperty(value: any): void;
    sourceProperty_onChange(sender: any, args: any): void;
    updateSourceProperty(value: any): void;
    targetProperty_onChange(sender: any, args: any): void;
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
/**
 * PropertyAttributeBinding class
 * Allows the binding of an attribute to a framework property.
 */
export declare class PropertyAttributeBinding extends Binding {
    constructor(source: object, sourceProperty: FrameworkProperty, targetElement: Element, targetAttributeName: string, options?: BindingOptions);
    private __observeAttributeChanges;
    private __doInitialUpdate;
    private __updateTargetAttribute;
    private __sourceProperty_onChange;
    private __updateSourceProperty;
    private __target_attributeSet_handler;
    get source(): object;
    private __source;
    get sourceProperty(): FrameworkProperty;
    private __sourceProperty;
    get targetElement(): Element;
    private __targetElement;
    get targetAttributeName(): string;
    private __targetAttributeName;
    private __isUpdadingFlag;
    private __attributeObserver;
    destructor(): void;
}
