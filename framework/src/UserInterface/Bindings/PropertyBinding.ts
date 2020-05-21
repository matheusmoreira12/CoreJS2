import { Binding, IBindingOptions } from "./index.js";
import { DependencyProperty, PropertyChangeEventArgs } from "../../Standard/DependencyObjects/index.js";
import { assertParams } from "../../Validation/index.js";
import { DependencyObject } from "../../Standard/DependencyObjects/DependencyObject.js";
import { FrameworkEvent } from "../../Standard/Events/index.js";
import { Enumeration } from "../../Standard/index.js";
import { BindingDirection } from "./Bindings.js";
import { IValueConverter } from "../ValueConverters/index.js";

import * as Storage from "../../Standard/DependencyObjects/_Storage.js";
import { Type } from "../../Standard/Types/index.js";

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

        this.set(PropertyBinding.sourceProperty, source);
        this.set(PropertyBinding.sourcePropertyProperty, sourceProperty);
        this.set(PropertyBinding.targetProperty, target);
        this.set(PropertyBinding.targetPropertyProperty, targetProperty);

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

    static sourceProperty = DependencyProperty.registerReadonly(PropertyBinding, "source", { valueType: Type.get(DependencyObject) });
    get source(): DependencyObject { return this.get(PropertyBinding.sourceProperty); }

    static sourcePropertyProperty = DependencyProperty.registerReadonly(PropertyBinding, "sourceProperty", { valueType: Type.get(DependencyObject) });
    get sourceProperty(): DependencyProperty { return this.get(PropertyBinding.sourcePropertyProperty); }

    static targetProperty = DependencyProperty.registerReadonly(PropertyBinding, "target", { valueType: Type.get(DependencyObject) });
    get target(): DependencyObject { return this.get(PropertyBinding.targetProperty); }

    static targetPropertyProperty = DependencyProperty.registerReadonly(PropertyBinding, "targetProperty", { valueType: Type.get(DependencyObject) });
    get targetProperty(): DependencyProperty { return this.get(PropertyBinding.targetPropertyProperty); }

    protected destructor(): void {
        this.__source_PropertyChangeEvent.destruct();
        this.__target_PropertyChangeEvent.destruct();
    }
}