import { Binding, IBindingOptions } from "./index.js";
import { DependencyProperty, PropertyChangeEventArgs } from "../DependencyObjects/index.js";
import { assertParams } from "../../Validation/index.js";
import { DependencyObject } from "../DependencyObjects/DependencyObject.js";
import { FrameworkEvent } from "../../Standard/Events/index.js";
import { Enumeration } from "../../Standard/index.js";
import { BindingDirection } from "./Bindings.js";
import { IValueConverter } from "../ValueConverters/index.js";

import * as Storage from "../DependencyObjects/Storage.js";

//Keys for PropertyBinding

/**
 * PropertyBinding class
 * Allows the binding of two framework properties.
 */
export class PropertyBinding extends Binding {
    constructor(source: DependencyObject, sourceProperty: DependencyProperty, target: DependencyObject, targetProperty: DependencyProperty, options?: IBindingOptions) {
        super(options);

        assertParams({ source }, [DependencyObject]);
        assertParams({ sourceProperty }, [DependencyProperty]);
        assertParams({ target }, [DependencyObject]);
        assertParams({ targetProperty }, [IBindingOptions]);

        this.__source = source;
        this.__sourceProperty = sourceProperty;
        this.__target = target;
        this.__targetProperty = targetProperty;

        this.__doInitialCrossingUpdate();

        source.PropertyChangeEvent.attach(this.__source_PropertyChangeEvent);
        target.PropertyChangeEvent.attach(this.__target_PropertyChangeEvent);
    }

    private __doInitialCrossingUpdate() {
        const sourcePropertyRawValue = Storage.getValue(this.source, this.sourceProperty);
        this.__updateTargetProperty(sourcePropertyRawValue);

        const targetPropertyRawValue = Storage.getValue(this.target, this.targetProperty);
        this.__updateSourceProperty(targetPropertyRawValue);
    }

    private __updateTargetProperty(sourceValue: any) {
        const canUpdateToTarget = Enumeration.contains(BindingDirection.ToTarget, this.options.direction!);
        if (canUpdateToTarget) {
            const hasValueConverter = !!this.options.valueConverter;
            let targetValue: any;
            if (hasValueConverter)
                targetValue = (<IValueConverter>this.options.valueConverter).convert(sourceValue);
            else
                targetValue = sourceValue;
            Storage.setValue(this, this.target, this.targetProperty, targetValue);
        }
    }

    private __source_onPropertyChange(_sender: any, args: PropertyChangeEventArgs) {
        const isSourceProperty = args.property === this.sourceProperty;
        if (isSourceProperty)
            this.__updateTargetProperty(args.newValue);
    }

    private __source_PropertyChangeEvent: FrameworkEvent<PropertyChangeEventArgs> = new FrameworkEvent(this.__source_onPropertyChange, this);

    private __updateSourceProperty(targetValue: any) {
        const canUpdateToSource = Enumeration.contains(BindingDirection.ToSource, this.options.direction!);
        if (canUpdateToSource) {
            const hasValueConverter = !!this.options.valueConverter;
            let sourceValue: any;
            if (hasValueConverter)
                sourceValue = (<IValueConverter>this.options.valueConverter).convert(targetValue);
            else
                sourceValue = targetValue;
            Storage.setValue(this, this.target, this.targetProperty, sourceValue);
        }
    }

    private __target_onPropertyChange(_sender: any, args: PropertyChangeEventArgs) {
        const isTargetProperty = args.property === this.targetProperty;
        if (isTargetProperty)
            this.__updateSourceProperty(args.newValue);
    }

    private __target_PropertyChangeEvent: FrameworkEvent<PropertyChangeEventArgs> = new FrameworkEvent(this.__target_onPropertyChange, this);

    get source(): DependencyObject { return this.__source; }
    private __source: DependencyObject;

    get sourceProperty(): DependencyProperty { return this.__sourceProperty; }
    private __sourceProperty: DependencyProperty;

    get target(): DependencyObject { return this.__target; }
    private __target: DependencyObject;

    get targetProperty(): DependencyProperty { return this.__targetProperty; }
    private __targetProperty: DependencyProperty;

    protected destructor(): void {
        this.__source_PropertyChangeEvent.destruct();
        this.__target_PropertyChangeEvent.destruct();
    }
}