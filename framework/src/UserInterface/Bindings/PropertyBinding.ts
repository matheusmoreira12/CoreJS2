import { Binding, IBindingOptions, BindingDirection } from "./index";
import { DependencyProperty, PropertyChangeEventArgs } from "../DependencyObjects/index";
import { ArgumentTypeException, Enumeration } from "../../Standard/index";

/**
 * PropertyBinding class
 * Allows the binding of two framework properties.
 */
export class PropertyBinding extends Binding {
    constructor(source: object, sourceProperty: DependencyProperty, target: object, targetProperty: DependencyProperty, options?: IBindingOptions) {
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

        sourceProperty.ChangeEvent.attach(this.sourceProperty_onChange, this);
        targetProperty.ChangeEvent.attach(this.targetProperty_onChange, this);
    }

    updateTargetProperty(value: any) {
        const options = this.__options;

        const direction = options.direction;
        if (!Enumeration.contains(BindingDirection.ToTarget, direction)) return;

        const valueConverter = options.valueConverter;
        if (valueConverter !== null)
            value = valueConverter.convert(value);

        this.targetProperty.set(this.__target, value);
    }

    sourceProperty_onChange(sender: any, args: PropertyChangeEventArgs) {
        if (args.target !== this.source) return;

        this.updateTargetProperty(args.newValue);
    }

    updateSourceProperty(value: any) {
        const options = this.__options;

        const direction = options.direction;
        if (!Enumeration.contains(BindingDirection.ToSource, direction)) return;

        const valueConverter = options.valueConverter;
        if (valueConverter !== null)
            value = valueConverter.convertBack(value);

        this.sourceProperty.set(this.__source, value);
    }

    targetProperty_onChange(sender: any, args: PropertyChangeEventArgs) {
        if (args.target !== this.__source) return;

        this.updateSourceProperty(args.newValue);
    }

    get source(): object { return this.__source; }
    private __source: object;

    get sourceProperty(): DependencyProperty { return this.__sourceProperty; }
    private __sourceProperty: DependencyProperty;

    get target(): object { return this.__target; }
    private __target: object;


    get targetProperty(): DependencyProperty { return this.__targetProperty; }
    private __targetProperty: DependencyProperty;

    destructor() {
        this.sourceProperty.ChangeEvent.detach(this.sourceProperty_onChange);
        this.targetProperty.ChangeEvent.detach(this.targetProperty_onChange);
    }
}