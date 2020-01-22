import { Binding, IBindingOptions } from "./index.js";
import { FrameworkProperty } from "../DependencyObjects/index.js";
/**
 * PropertyAttributeBinding class
 * Allows the binding of an attribute to a framework property.
 */
export declare class PropertyAttributeBinding extends Binding {
    constructor(source: object, sourceProperty: FrameworkProperty, targetElement: Element, targetAttributeName: string, options?: IBindingOptions);
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
