import { Enumeration } from "../Standard/Enumeration";
import { Interface, InterfaceMember, InterfaceMemberType } from "../Standard/Interfaces/Interface";
import { Type } from "../Standard/Types/Types";
import { IValueConverter } from "../Standard/Standard";
import { ArgumentTypeException, InvalidOperationException } from "../Standard/Exceptions";
import { FrameworkProperty } from "./user-interface";
import { Destructible } from "../Standard/Destructible";
export const BindingDirection = new Enumeration({
    Both: 3,
    ToTarget: 1,
    ToSource: 2
});
export const IBindingOptions = new Interface(new InterfaceMember("direction", InterfaceMemberType.Property, Type.get(Number), undefined, true), new InterfaceMember("valueConverter", InterfaceMemberType.Property, Type.get(IValueConverter), undefined, true));
;
const DEFAULT_BINDING_OPTIONS = {
    direction: BindingDirection.Both,
    valueConverter: null
};
/**
 * Binding base class
 *
 */
export class Binding extends Destructible {
    constructor(options = null) {
        if (new.target === Binding)
            throw new InvalidOperationException("Invalid constructor.");
        super();
        if (options !== null && !Type.of(options).implements(IBindingOptions))
            throw new ArgumentTypeException("options", Type.of(options), IBindingOptions);
        this.__options = Object.assign({}, DEFAULT_BINDING_OPTIONS, options);
    }
    get options() { return this.__options; }
}
/**
 * PropertyBinding class
 * Allows the binding of two framework properties.
 */
export class PropertyBinding extends Binding {
    constructor(source, sourceProperty, target, targetProperty, options) {
        super(options);
        if (!(source instanceof Object))
            throw new ArgumentTypeException("source", source, Object);
        if (!(sourceProperty instanceof FrameworkProperty))
            throw new ArgumentTypeException("sourceProperty", sourceProperty, FrameworkProperty);
        if (!(target instanceof Object))
            throw new ArgumentTypeException("target", target, Object);
        if (!(targetProperty instanceof FrameworkProperty))
            throw new ArgumentTypeException("targetProperty", targetProperty, Object);
        this.__source = source;
        this.__sourceProperty = sourceProperty;
        this.__target = target;
        this.__targetProperty = targetProperty;
        sourceProperty.ChangeEvent.attach(this.sourceProperty_onChange, this);
        targetProperty.ChangeEvent.attach(this.targetProperty_onChange, this);
    }
    updateTargetProperty(value) {
        const options = this.__options;
        const direction = options.direction;
        if (!BindingDirection.contains(BindingDirection.ToTarget, direction))
            return;
        const valueConverter = options.valueConverter;
        if (valueConverter !== null)
            value = valueConverter.convert(value);
        this.targetProperty.set(this.__target, value);
    }
    sourceProperty_onChange(sender, args) {
        if (args.target !== this.source)
            return;
        this.updateTargetProperty(args.newValue);
    }
    updateSourceProperty(value) {
        const options = this.__options;
        const direction = options.direction;
        if (!BindingDirection.contains(BindingDirection.ToSource, direction))
            return;
        const valueConverter = options.valueConverter;
        if (valueConverter !== null)
            value = valueConverter.convertBack(value);
        this.sourceProperty.set(this.__source, value);
    }
    targetProperty_onChange(sender, args) {
        if (args.target !== this.__source)
            return;
        this.updateSourceProperty(args.newValue);
    }
    get source() { return this.__source; }
    get sourceProperty() { return this.__sourceProperty; }
    get target() { return this.__target; }
    get targetProperty() { return this.__targetProperty; }
    destructor() {
        this.sourceProperty.ChangeEvent.detach(this.sourceProperty_onChange);
        this.targetProperty.ChangeEvent.detach(this.targetProperty_onChange);
    }
}
/**
 * PropertyAttributeBinding class
 * Allows the binding of an attribute to a framework property.
 */
export class PropertyAttributeBinding extends Binding {
    constructor(source, sourceProperty, targetElement, targetAttributeName, options) {
        super(options);
        this.__target_attributeSet_handler = (() => {
            this.__updateSourceProperty();
        }).bind(this);
        this.__isUpdadingFlag = false;
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
        this.__observeAttributeChanges();
        this.__doInitialUpdate();
    }
    __observeAttributeChanges() {
        const self = this;
        let attributeObserver = new MutationObserver(mutations => {
            for (let mutation of mutations)
                if (mutation.attributeName === self.targetAttributeName)
                    self.__target_attributeSet_handler();
        });
        attributeObserver.observe(this.targetElement, { attributes: true, attributeOldValue: true });
        this.__attributeObserver = attributeObserver;
    }
    __doInitialUpdate() {
        if (this.targetElement.hasAttribute(this.targetAttributeName))
            this.__updateSourceProperty();
    }
    __updateTargetAttribute(value) {
        const options = this.__options;
        const direction = options.direction;
        if (!BindingDirection.contains(BindingDirection.ToTarget, direction))
            return;
        if (this.__isUpdadingFlag)
            return;
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
    __sourceProperty_onChange(sender, args) {
        if (!Object.is(args.target, this.source))
            return;
        this.__updateTargetAttribute(args.newValue);
    }
    __updateSourceProperty() {
        const options = this.__options;
        const direction = options.direction;
        if (!BindingDirection.contains(BindingDirection.ToSource, direction))
            return;
        if (this.__isUpdadingFlag)
            return;
        this.__isUpdadingFlag = true;
        let value = null;
        if (this.targetElement.hasAttribute(this.targetAttributeName))
            value = this.targetElement.getAttribute(this.targetAttributeName);
        ///TODO: once angularjs is OUT, remove the following block:
        if (value.startsWith("{{")) {
            this.__isUpdadingFlag = false;
            return;
        }
        let valueConverter = options.valueConverter;
        if (valueConverter !== null)
            value = valueConverter.convertBack(value);
        this.sourceProperty.set(this.source, value);
        this.__isUpdadingFlag = false;
    }
    get source() { return this.__source; }
    get sourceProperty() { return this.__sourceProperty; }
    get targetElement() { return this.__targetElement; }
    get targetAttributeName() { return this.__targetAttributeName; }
    destructor() {
        this.__sourceProperty.ChangeEvent.detach(this.__sourceProperty_onChange);
        this.__attributeObserver.disconnect();
    }
}
