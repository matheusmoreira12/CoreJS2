import { Destructible } from "./Standard.Destructible.js";
import { Enumeration } from "./Standard.Enumeration.js";
export declare const BindingDirection: Enumeration;
export declare const IBindingOptions: any;
/**
 * Binding base class
 *
 */
export declare class Binding extends Destructible {
    constructor(options?: any);
    destruct(): void;
}
/**
 * PropertyBinding class
 * Allows the binding of two framework properties.
 */
export declare class PropertyBinding extends Binding {
    constructor(source: any, sourceProperty: any, target: any, targetProperty: any, options?: any);
}
/**
 * PropertyAttributeBinding class
 * Allows the binding of an attribute to a framework property.
 */
export declare class PropertyAttributeBinding extends Binding {
    constructor(source: any, sourceProperty: any, targetElement: any, targetAttributeName: any, options: any);
}
