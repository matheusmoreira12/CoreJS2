import { Binding, IBindingOptions, BindingDirection } from "./index.js";
import { FrameworkProperty } from "../DependencyObjects/index.js";
import { ArgumentTypeException } from "../../Standard/index.js";

/**
 * PropertyAttributeBinding class
 * Allows the binding of an attribute to a framework property.
 */
export class PropertyAttributeBinding extends Binding {
    constructor(source: object, sourceProperty: FrameworkProperty, targetElement: Element, targetAttributeName: string, options?: IBindingOptions) {
        super(options);

        if (!(source instanceof Object))
            throw new ArgumentTypeException("source", source, Object);
        if (!(sourceProperty instanceof FrameworkProperty))
            throw new ArgumentTypeException("sourceProperty", sourceProperty, FrameworkProperty);
        if (!(targetElement instanceof Element))
            throw new ArgumentTypeException("targetElement", targetElement, Element);
        if (typeof targetAttributeName !== "string")
            throw new ArgumentTypeException("targetAttributeName", targetAttributeName, String);

        this.__source = source;
        this.__sourceProperty = sourceProperty;
        this.__targetElement = targetElement;
        this.__targetAttributeName = targetAttributeName;

        sourceProperty.ChangeEvent.attach(this.__sourceProperty_onChange, this);

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
        if (!BindingDirection.contains(BindingDirection.ToTarget, direction)) return;

        if (this.__isUpdadingFlag) return;
        this.__isUpdadingFlag = true;

        let valueConverter = options.valueConverter;
        if (valueConverter !== null)
            value = valueConverter.convert(value);

        if (value === null)
            this.targetElement.removeAttribute(this.targetAttributeName);
        else
            this.targetElement.setAttribute(this.targetAttributeName, value);

        this.__isUpdadingFlag = false;
    }

    private __sourceProperty_onChange(sender: object, args: any) {
        if (!Object.is(args.target, this.source)) return;

        this.__updateTargetAttribute(args.newValue);
    }

    private __updateSourceProperty() {
        const options = this.__options;
        const direction = options.direction;
        if (!BindingDirection.contains(BindingDirection.ToSource, direction)) return;

        if (this.__isUpdadingFlag) return;
        this.__isUpdadingFlag = true;

        let value = null;
        if (this.targetElement.hasAttribute(this.targetAttributeName))
            value = this.targetElement.getAttribute(this.targetAttributeName);

        ///TODO: once angularjs is OUT, remove the following block:
        if (value && value.startsWith("{{")) {
            this.__isUpdadingFlag = false;
            return;
        }

        let valueConverter = options.valueConverter;
        if (valueConverter !== null)
            value = valueConverter.convertBack(value);

        this.sourceProperty.set(this.source, value);

        this.__isUpdadingFlag = false;
    }

    private __target_attributeSet_handler = ((mutations: MutationRecord[]) => {
        for (let mutation of mutations)
            if (mutation.attributeName === this.targetAttributeName)
                 this.__updateSourceProperty();
    }).bind(this);

    get source() { return this.__source; }
    private __source: object;

    get sourceProperty() { return this.__sourceProperty; }
    private __sourceProperty: FrameworkProperty;

    get targetElement() { return this.__targetElement; }
    private __targetElement: Element;

    get targetAttributeName() { return this.__targetAttributeName; }
    private __targetAttributeName: string;

    private __isUpdadingFlag: boolean = false;
    private __attributeObserver: MutationObserver;

    destructor() {
        this.__sourceProperty.ChangeEvent.detach(this.__sourceProperty_onChange);
        this.__attributeObserver.disconnect();
    }
}