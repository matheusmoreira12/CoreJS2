export const BindingDirection = new Enumeration({
    Both: 3,
    ToTarget: 1,
    ToSource: 2
});

export const IBindingOptions = new Interface(
    new InterfaceProperty("direction", Type.get(Number), MemberSelectionAttributes.Any, true),
    new InterfaceProperty("valueConverter", IValueConverter, MemberSelectionAttributes.Any, true)
);

const DEFAULT_BINDING_OPTIONS = {
    direction: BindingDirection.Both,
    valueConverter: null
};

class BindingWorker extends Worker {
    initialize(options) {
        super.initialize();

        this.options = options;
    }

    getComputedOptions() {
        return Object.assign({}, DEFAULT_BINDING_OPTIONS, this.options);
    }
}

/**
 * Binding base class
 *
 */
export class Binding extends Destructible {
    constructor(options = null) {
        if (options !== null && !Type.of(options).implements(IBindingOptions))
            throw new ArgumentTypeException("options", Type.of(options), IBindingOptions);

        super(options);

        if (this.constructor === Binding)
            throw new InvalidOperationException("Invalid constructor.");

        Worker.create(this, BindingWorker, options);
    }

    destruct() {
        super.destruct();

        Worker.delete(this);
    }
}

class PropertyBindingWorker extends BindingWorker {
    initialize(source, sourceProperty, target, targetProperty, options) {
        super.initialize(options);

        this.source = source;
        this.sourceProperty = sourceProperty;
        this.target = target;
        this.targetProperty = targetProperty;

        sourceProperty.ChangeEvent.attach(this.sourceProperty_onChange, this);
        targetProperty.ChangeEvent.attach(this.targetProperty_onChange, this);
    }

    finalize() {
        this.sourceProperty.ChangeEvent.detach(this.sourceProperty_onChange);
        this.targetProperty.ChangeEvent.detach(this.targetProperty_onChange);

        super.finalize();
    }

    updateTargetProperty(value) {
        const options = this.getComputedOptions();
        if (!Enumeration.isFlagSet(BindingDirection.ToTarget, options.direction)) return;

        const valueConverter = options.valueConverter;
        if (valueConverter !== null)
            value = valueConverter.convert(value);

        this.targetProperty.set(this.target, value);
    }

    sourceProperty_onChange(sender, args) {
        if (args.target !== this.source) return;

        this.updateTargetProperty(args.newValue);
    }

    updateSourceProperty(value) {
        const options = this.getComputedOptions();
        if (!Enumeration.isFlagSet(BindingDirection.ToSource, options.direction)) return;

        const valueConverter = options.valueConverter;
        if (valueConverter !== null)
            value = valueConverter.convertBack(value);

        this.sourceProperty.set(this.source, value);
    }

    targetProperty_onChange(sender, args) {
        if (args.target !== this.source) return;

        this.updateSourceProperty(args.newValue);
    }

    //Exposed Methods
    get_source() { return this.source; }
    get_sourceProperty() { return this.sourceProperty; }
    get_target() { return this.target; }
    get_targetProperty() { return this.targetProperty; }
    get_options() { return this.options; }
}

/**
 * PropertyBinding class
 * Allows the binding of two framework properties.
 */
export class PropertyBinding extends Binding {
    constructor(source, sourceProperty, target, targetProperty, options = null) {
        if (!(source instanceof Object))
            throw new ArgumentTypeException("source", source, Object);
        if (!(sourceProperty instanceof FrameworkProperty))
            throw new ArgumentTypeException("sourceProperty", sourceProperty, FrameworkProperty);
        if (!(target instanceof Object))
            throw new ArgumentTypeException("target", target, Object);
        if (!(targetProperty instanceof FrameworkProperty))
            throw new ArgumentTypeException("targetProperty", targetProperty, Object);

        super(options);

        Worker.override(this, PropertyBindingWorker, source, sourceProperty, target, targetProperty, options);
    }
}

class PropertyAttributeBindingWorker extends BindingWorker {
    initialize(source, sourceProperty, targetElement, targetAttributeName, options) {
        super.initialize(options);

        this.source = source;
        this.sourceProperty = sourceProperty;
        this.targetElement = targetElement;
        this.targetAttributeName = targetAttributeName;

        sourceProperty.ChangeEvent.attach(this.sourceProperty_onChange, this);

        this.observeAttributeChanges();
        this.doInitialUpdate();
    }

    finalize() {
        this.sourceProperty.ChangeEvent.detach(this.sourceProperty_onChange);
        this.attributeObserver.disconnect();

        super.finalize();
    }

    observeAttributeChanges() {
        const self = this;

        let attributeObserver = new MutationObserver(mutations => {
            for (let mutation of mutations)
                if (mutation.attributeName === self.targetAttributeName)
                    self.onTargetAttributeSet();
        });
        attributeObserver.observe(this.targetElement, { attributes: true, attributeOldValue: true });
        this.attributeObserver = attributeObserver;
    }

    doInitialUpdate() {
        if (this.targetElement.hasAttribute(this.targetAttributeName))
            this.updateSourceProperty();
    }

    updateTargetAttribute(value) {
        let options = this.getComputedOptions();
        if (!Enumeration.isFlagSet(BindingDirection.ToTarget, options.direction)) return;

        if (this.isUpdadingFlag) return;
        this.isUpdadingFlag = true;

        let valueConverter = options.valueConverter;
        if (valueConverter !== null)
            value = valueConverter.convert(value);

        if (value === null)
            this.targetElement.removeAttribute(this.targetAttributeName);
        else
            this.targetElement.setAttribute(this.targetAttributeName, value);

        this.isUpdadingFlag = false;
    }

    sourceProperty_onChange(sender, args) {
        if (!Object.is(args.target, this.source)) return;

        this.updateTargetAttribute(args.newValue);
    }

    updateSourceProperty() {
        let options = this.getComputedOptions();
        if (!Enumeration.isFlagSet(BindingDirection.ToSource, options.direction)) return;

        if (this.isUpdadingFlag) return;
        this.isUpdadingFlag = true;

        let value = null;
        if (this.targetElement.hasAttribute(this.targetAttributeName))
            value = this.targetElement.getAttribute(this.targetAttributeName);

        ///TODO: once angularjs is OUT, remove the following block:
        if (value.startsWith("{{")) {
            this.isUpdadingFlag = false;
            return;
        }

        let valueConverter = options.valueConverter;
        if (valueConverter !== null)
            value = valueConverter.convertBack(value);

        this.sourceProperty.set(this.source, value);

        this.isUpdadingFlag = false;
    }

    onTargetAttributeSet() {
        this.updateSourceProperty();
    }

    isUpdadingFlag = false;

    get_source() { return this.source; }
    get_sourceProperty() { return this.sourceProperty; }
    get_targetElement() { return this.targetElement; }
    get_targetAttributeName() { return this.targetAttributeName; }
    get_options() { return this.options; }
}

/**
 * PropertyAttributeBinding class
 * Allows the binding of an attribute to a framework property.
 */
export class PropertyAttributeBinding extends Binding {
    constructor(source, sourceProperty, targetElement, targetAttributeName, options) {
        if (!(source instanceof Object))
            throw new ArgumentTypeException("source", source, Object);
        if (!(sourceProperty instanceof FrameworkProperty))
            throw new ArgumentTypeException("sourceProperty", sourceProperty, FrameworkProperty);
        if (!(targetElement instanceof Element))
            throw new ArgumentTypeException("targetElement", targetElement, Element);
        if (typeof targetAttributeName !== "string")
            throw new ArgumentTypeException("targetAttributeName", targetAttributeName, String);

        super(options);

        Worker.override(this, PropertyAttributeBindingWorker, source, sourceProperty, targetElement, targetAttributeName, options);
    }
}