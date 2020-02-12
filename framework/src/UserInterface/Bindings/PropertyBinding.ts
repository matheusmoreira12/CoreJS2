import { Binding, IBindingOptions, BindingDirection } from "./index";
import { DependencyProperty, PropertyChangeEventArgs, DependencyObject } from "../DependencyObjects/index";
import { ArgumentTypeException, Enumeration } from "../../Standard/index";

/**
 * PropertyBinding class
 * Allows the binding of two framework properties.
 */
export class PropertyBinding extends Binding {
    constructor(source: DependencyObject, sourceProperty: DependencyProperty, target: DependencyObject, targetProperty: DependencyProperty, options?: IBindingOptions) {
        super(options);

        if (!(source instanceof Object))
            throw new ArgumentTypeException("source", source, Object);
        if (!(sourceProperty instanceof DependencyProperty))
            throw new ArgumentTypeException("sourceProperty", sourceProperty, DependencyProperty);
        if (!(target instanceof Object))
            throw new ArgumentTypeException("target", target, Object);
        if (!(targetProperty instanceof DependencyProperty))
            throw new ArgumentTypeException("targetProperty", targetProperty, Object);

        this.__source = source;
        this.__sourceProperty = sourceProperty;
        this.__target = target;
        this.__targetProperty = targetProperty;

        source.PropertyChangeEvent.attach(this.source_onPropertyChange, this);
        target.PropertyChangeEvent.attach(this.target_onPropertyChange, this);
    }

    updateTargetProperty(value: any) {
        const options = this.__options;

        const direction = options.direction;
        if (direction && Enumeration.contains(BindingDirection.ToTarget, direction)) {
            const valueConverter = options.valueConverter;
            if (valueConverter)
                value = valueConverter.convert(value);

            this.target.set(this.targetProperty, value);
        }
    }

    source_onPropertyChange(sender: any, args: PropertyChangeEventArgs) {
        if (args.target !== this.source) return;

        this.updateTargetProperty(args.newValue);
    }

    updateSourceProperty(value: any) {
        const options = this.__options;

        const direction = options.direction;
        if (direction && Enumeration.contains(BindingDirection.ToSource, direction)) {
            const valueConverter = options.valueConverter;
            if (valueConverter)
                value = valueConverter.convertBack(value);

            this.source.set(this.sourceProperty, value);
        }
    }

    target_onPropertyChange(sender: any, args: PropertyChangeEventArgs) {
        if (args.target !== this.__source) return;

        this.updateSourceProperty(args.newValue);
    }

    get source(): DependencyObject { return this.__source; }
    private __source: DependencyObject;

    get sourceProperty(): DependencyProperty { return this.__sourceProperty; }
    private __sourceProperty: DependencyProperty;

    get target(): DependencyObject { return this.__target; }
    private __target: DependencyObject;


    get targetProperty(): DependencyProperty { return this.__targetProperty; }
    private __targetProperty: DependencyProperty;

    destructor() {
        this.source.PropertyChangeEvent.detach(this.source_onPropertyChange);
        this.target.PropertyChangeEvent.detach(this.target_onPropertyChange);
    }
}