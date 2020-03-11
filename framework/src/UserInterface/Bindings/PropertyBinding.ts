import { Binding, IBindingOptions } from "./index";
import { DependencyProperty, PropertyChangeEventArgs } from "../DependencyObjects/index";
import { assertParams } from "../../Validation/index";
import { DependencyObject } from "../DependencyObjects/DependencyObject";
import { FrameworkEvent } from "../../Standard/Events/index";
import { Enumeration } from "../../Standard/index";
import { BindingDirection } from "./Bindings";
import { IValueConverter } from "../ValueConverters/index";

import * as Storage from "../DependencyObjects/Storage";

//Keys for PropertyBinding
const $source = Symbol();
const $sourceProperty = Symbol();
const $target = Symbol();
const $targetProperty = Symbol();

/**
 * PropertyBinding class
 * Allows the binding of two framework properties.
 */
export class PropertyBinding extends Binding {
    constructor(source: DependencyObject, sourceProperty: DependencyProperty, target: DependencyObject, targetProperty: DependencyProperty, options?: IBindingOptions) {
        super(options);

        assertParams({ source }, DependencyObject);
        assertParams({ sourceProperty }, DependencyProperty);
        assertParams({ target }, DependencyObject);
        assertParams({ targetProperty }, IBindingOptions);

        this[$source] = source;
        this[$sourceProperty] = sourceProperty;
        this[$target] = target;
        this[$targetProperty] = targetProperty;

        this.__source_PropertyChangeEvent = new FrameworkEvent(this.__source_onPropertyChange, this);
        source.PropertyChangeEvent.attach(this.__source_PropertyChangeEvent);
        this.__target_PropertyChangeEvent = new FrameworkEvent(this.__target_onPropertyChange, this);
        target.PropertyChangeEvent.attach(this.__target_PropertyChangeEvent);

        this.__doInitialCrossingUpdate();
    }

    private __doInitialCrossingUpdate() {
        const sourcePropertyRawValue = Storage.getRawValue(this.source, this.sourceProperty);
        this.__updateTargetProperty(sourcePropertyRawValue);

        const targetPropertyRawValue = Storage.getRawValue(this.target, this.targetProperty);
        this.__updateSourceProperty(targetPropertyRawValue);
    }

    private __updateTargetProperty(sourceValue: any) {
        const canUpdateToTarget = Enumeration.contains(BindingDirection.ToTarget, this.options.direction || 0);
        if (canUpdateToTarget) {
            const hasValueConverter = !!this.options.valueConverter;
            let targetValue: any;
            if (hasValueConverter)
                targetValue = (<IValueConverter>this.options.valueConverter).convert(sourceValue);
            else
                targetValue = sourceValue;

            if (targetValue === null)
                Storage.unsetValue(this, this.target, this.targetProperty);
            else
                Storage.setValue(this, this.target, this.targetProperty, targetValue);
        }
    }

    private __source_onPropertyChange(sender: any, args: PropertyChangeEventArgs) {
        const isSourceProperty = args.property === this.sourceProperty;
        if (isSourceProperty) {
            const sourcePropertyRawValue = Storage.getRawValue(this.target, this.targetProperty);
            this.__updateTargetProperty(sourcePropertyRawValue);
        }
    }

    private __source_PropertyChangeEvent: FrameworkEvent<PropertyChangeEventArgs>;

    private __updateSourceProperty(targetValue: any) {
        const canUpdateToSource = Enumeration.contains(BindingDirection.ToTarget, this.options.direction || 0);
        if (canUpdateToSource) {
            const hasValueConverter = !!this.options.valueConverter;
            let sourceValue: any;
            if (hasValueConverter)
                sourceValue = (<IValueConverter>this.options.valueConverter).convert(targetValue);
            else
                sourceValue = targetValue;

            if (sourceValue === null)
                Storage.unsetValue(this, this.target, this.targetProperty);
            else
                Storage.setValue(this, this.target, this.targetProperty, sourceValue);
        }
    }

    private __target_onPropertyChange(sender: any, args: PropertyChangeEventArgs) {
        const isTargetProperty = args.property === this.sourceProperty;
        if (isTargetProperty) {
            const targetPropertyRawValue = Storage.getRawValue(this.target, this.targetProperty);
            this.__updateSourceProperty(targetPropertyRawValue);
        }
    }

    private __target_PropertyChangeEvent: FrameworkEvent<PropertyChangeEventArgs>;

    get source(): DependencyObject { return this[$source]; }
    private [$source]: DependencyObject;

    get sourceProperty(): DependencyProperty { return this[$sourceProperty]; }
    private [$sourceProperty]: DependencyProperty;

    get target(): DependencyObject { return this[$target]; }
    private [$target]: DependencyObject;

    get targetProperty(): DependencyProperty { return this[$targetProperty]; }
    private [$targetProperty]: DependencyProperty;

    protected destructor(): void {
        this.__source_PropertyChangeEvent.destruct();
        this.__target_PropertyChangeEvent.destruct();
    }
}