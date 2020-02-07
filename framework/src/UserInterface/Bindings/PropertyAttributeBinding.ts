import { Binding, IBindingOptions, BindingDirection } from "./index";
import { DependencyProperty, DependencyObject, PropertyChangeEventArgs } from "../../Standard/DependencyObjects/index";
import { ArgumentTypeException, Enumeration } from "../../Standard/index";

/**
 * PropertyAttributeBinding class
 * Allows the binding of an attribute to a framework property.
 */
export class PropertyAttributeBinding extends Binding {
    constructor(source: DependencyObject, sourceProperty: DependencyProperty, targetElement: Element, targetAttributeName: string, options?: IBindingOptions) {
        super(options);

        if (!(source instanceof Object))
            throw new ArgumentTypeException("source", source, Object);
        if (!(sourceProperty instanceof DependencyProperty))
            throw new ArgumentTypeException("sourceProperty", sourceProperty, DependencyProperty);
        if (!(targetElement instanceof Element))
            throw new ArgumentTypeException("targetElement", targetElement, Element);
        if (typeof targetAttributeName !== "string")
            throw new ArgumentTypeException("targetAttributeName", targetAttributeName, String);

        this.__source = source;
        this.__sourceProperty = sourceProperty;
        this.__targetElement = targetElement;
        this.__targetAttributeName = targetAttributeName;

        source.PropertyChangeEvent.attach(this.__target_onPropertyChange, this);

        this.__attributeObserver = new MutationObserver(this.__target_attributeSet_handler);
        this.__observeAttributeChanges();

        this.__doInitialUpdate();
    }

    private __observeAttributeChanges() {
        this.__attributeObserver.observe(this.targetElement, { attributes: true, attributeOldValue: true });
    }

    private __doInitialUpdate() {
        if (this.targetElement.hasAttribute(this.targetAttributeName))
            this.__updateSourceProperty();
    }

    private __updateTargetAttribute(value: any) {
        const options = this.__options;
        const direction = options.direction;
        if (direction && Enumeration.contains(BindingDirection.ToTarget, direction)) {
            if (!this.__isUpdadingFlag) {
                this.__isUpdadingFlag = true;

                let valueConverter = options.valueConverter;
                if (valueConverter)
                    value = valueConverter.convert(value);

                if (value === null)
                    this.targetElement.removeAttribute(this.targetAttributeName);
                else
                    this.targetElement.setAttribute(this.targetAttributeName, value);

                this.__isUpdadingFlag = false;
            }
        }
    }

    private __target_onPropertyChange(sender: DependencyObject, args: PropertyChangeEventArgs) {
        if (args.property === this.__sourceProperty)
            this.__updateTargetAttribute(args.newValue);
    }

    private __updateSourceProperty() {
        const options = this.__options;
        const direction = options.direction;
        if (direction && Enumeration.contains(BindingDirection.ToSource, direction)) {
            if (this.__isUpdadingFlag) {
                this.__isUpdadingFlag = true;

                let value = null;
                if (this.targetElement.hasAttribute(this.targetAttributeName))
                    value = this.targetElement.getAttribute(this.targetAttributeName);

                let valueConverter = options.valueConverter;
                if (valueConverter)
                    value = valueConverter.convertBack(value);

                this.__source.set(this.__sourceProperty, value);

                this.__isUpdadingFlag = false;
            }
        }
    }

    private __target_attributeSet_handler = ((mutations: MutationRecord[]) => {
        for (let mutation of mutations) {
            if (mutation.attributeName === this.targetAttributeName)
                this.__updateSourceProperty();
        }
    }).bind(this);

    get source(): DependencyObject { return this.__source; }
    private __source: DependencyObject;

    get sourceProperty(): DependencyProperty { return this.__sourceProperty; }
    private __sourceProperty: DependencyProperty;

    get targetElement(): Element { return this.__targetElement; }
    private __targetElement: Element;

    get targetAttributeName(): string { return this.__targetAttributeName; }
    private __targetAttributeName: string;

    private __isUpdadingFlag: boolean = false;
    private __attributeObserver: MutationObserver;

    destructor() {
        this.__source.PropertyChangeEvent.detach(this.__target_onPropertyChange);
        this.__attributeObserver.disconnect();
    }
}