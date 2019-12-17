import { Destructible } from "./Standard.Destructible.js";
import { Enumeration } from "./Standard.Enumeration.js";
export declare namespace Core.UserInterface {
    const BindingDirection: Enumeration;
    const IBindingOptions: any;
    /**
     * Binding base class
     *
     */
    class Binding extends Destructible {
        constructor(options?: any);
        destruct(): void;
    }
    /**
     * PropertyBinding class
     * Allows the binding of two framework properties.
     */
    class PropertyBinding extends Binding {
        constructor(source: any, sourceProperty: any, target: any, targetProperty: any, options?: any);
    }
    /**
     * PropertyAttributeBinding class
     * Allows the binding of an attribute to a framework property.
     */
    class PropertyAttributeBinding extends Binding {
        constructor(source: any, sourceProperty: any, targetElement: any, targetAttributeName: any, options: any);
    }
}
