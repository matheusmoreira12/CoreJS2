"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Enumeration_1 = require("../Standard/Enumeration");
const Interface_1 = require("../Standard/Interfaces/Interface");
const Types_1 = require("../Standard/Types/Types");
const Standard_1 = require("../Standard/Standard");
const Exceptions_1 = require("../Standard/Exceptions");
const user_interface_1 = require("./user-interface");
const Destructible_1 = require("../Standard/Destructible");
exports.BindingDirection = new Enumeration_1.Enumeration({
    Both: 3,
    ToTarget: 1,
    ToSource: 2
});
exports.IBindingOptions = new Interface_1.Interface(new Interface_1.InterfaceMember("direction", Interface_1.InterfaceMemberType.Property, Types_1.Type.get(Number), undefined, true), new Interface_1.InterfaceMember("valueConverter", Interface_1.InterfaceMemberType.Property, Types_1.Type.get(Standard_1.IValueConverter), undefined, true));
;
const DEFAULT_BINDING_OPTIONS = {
    direction: exports.BindingDirection.Both,
    valueConverter: null
};
/**
 * Binding base class
 *
 */
class Binding extends Destructible_1.Destructible {
    constructor(options = null) {
        if (new.target === Binding)
            throw new Exceptions_1.InvalidOperationException("Invalid constructor.");
        super();
        if (options !== null && !Types_1.Type.of(options).implements(exports.IBindingOptions))
            throw new Exceptions_1.ArgumentTypeException("options", Types_1.Type.of(options), exports.IBindingOptions);
        this.__options = Object.assign({}, DEFAULT_BINDING_OPTIONS, options);
    }
    get options() { return this.__options; }
}
exports.Binding = Binding;
/**
 * PropertyBinding class
 * Allows the binding of two framework properties.
 */
class PropertyBinding extends Binding {
    constructor(source, sourceProperty, target, targetProperty, options) {
        super(options);
        if (!(source instanceof Object))
            throw new Exceptions_1.ArgumentTypeException("source", source, Object);
        if (!(sourceProperty instanceof user_interface_1.FrameworkProperty))
            throw new Exceptions_1.ArgumentTypeException("sourceProperty", sourceProperty, user_interface_1.FrameworkProperty);
        if (!(target instanceof Object))
            throw new Exceptions_1.ArgumentTypeException("target", target, Object);
        if (!(targetProperty instanceof user_interface_1.FrameworkProperty))
            throw new Exceptions_1.ArgumentTypeException("targetProperty", targetProperty, Object);
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
        if (!exports.BindingDirection.contains(exports.BindingDirection.ToTarget, direction))
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
        if (!exports.BindingDirection.contains(exports.BindingDirection.ToSource, direction))
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
exports.PropertyBinding = PropertyBinding;
/**
 * PropertyAttributeBinding class
 * Allows the binding of an attribute to a framework property.
 */
class PropertyAttributeBinding extends Binding {
    constructor(source, sourceProperty, targetElement, targetAttributeName, options) {
        super(options);
        this.__target_attributeSet_handler = (() => {
            this.__updateSourceProperty();
        }).bind(this);
        this.__isUpdadingFlag = false;
        if (!(source instanceof Object))
            throw new Exceptions_1.ArgumentTypeException("source", source, Object);
        if (!(sourceProperty instanceof user_interface_1.FrameworkProperty))
            throw new Exceptions_1.ArgumentTypeException("sourceProperty", sourceProperty, user_interface_1.FrameworkProperty);
        if (!(targetElement instanceof Element))
            throw new Exceptions_1.ArgumentTypeException("targetElement", targetElement, Element);
        if (typeof targetAttributeName !== "string")
            throw new Exceptions_1.ArgumentTypeException("targetAttributeName", targetAttributeName, String);
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
        if (!exports.BindingDirection.contains(exports.BindingDirection.ToTarget, direction))
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
        if (!exports.BindingDirection.contains(exports.BindingDirection.ToSource, direction))
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
exports.PropertyAttributeBinding = PropertyAttributeBinding;
