import { Binding, BindingDirection } from "./index.js";
import { DependencyObject, DependencyProperty, PropertyChangeEventArgs } from "../../standard/dependency-objects/index.js";
import { assertParams } from "../../validation/index.js";
import { FrameworkEvent } from "../../standard/events/index.js";
import { Enumeration } from "../../standard/index.js";
import { IValueConverter } from "../value-converters/index.js";

import { __Storage } from "../../standard/dependency-objects/__storage.js";

/**
 * PropertyBinding class
 * Allows the binding of two framework properties.
 */
export class PropertyBinding extends Binding {
    constructor(source: DependencyObject, sourceProperty: DependencyProperty, target: DependencyObject, targetProperty: DependencyProperty, direction: number = BindingDirection.Both, valueConverter?: IValueConverter) {
        super(direction, valueConverter);

        assertParams({ source }, [DependencyObject]);
        assertParams({ sourceProperty }, [DependencyProperty]);
        assertParams({ target }, [DependencyObject]);
        assertParams({ targetProperty }, [DependencyProperty]);

        this.__source = source;
        this.__sourceProperty = sourceProperty;
        this.__target = target;
        this.__targetProperty = targetProperty;

        this.__doInitialCrossingUpdate();

        source.PropertyChangeEvent.attach(this.__source_PropertyChangeEvent);
        target.PropertyChangeEvent.attach(this.__target_PropertyChangeEvent);
    }

    private __doInitialCrossingUpdate() {
        const sourcePropertyValue = this.source.get(this.sourceProperty);
        this.__updateTargetProperty(sourcePropertyValue);

        const targetPropertyValue = this.target.get(this.targetProperty);
        this.__updateSourceProperty(targetPropertyValue);
    }

    private __updateTargetProperty(sourceValue: any) {
        const canUpdateToTarget = Enumeration.contains(BindingDirection.ToTarget, this.direction!);
        if (canUpdateToTarget) {
            let newTargetValue: any;
            if (this.valueConverter)
                newTargetValue = this.valueConverter.convert(sourceValue);
            else
                newTargetValue = sourceValue;
            __Storage.trySetValue(this, this.target, this.targetProperty, newTargetValue);
        }
    }

    private __source_onPropertyChange(_sender: any, args: PropertyChangeEventArgs) {
        const isSourceProperty = args.property === this.sourceProperty;
        if (isSourceProperty)
            this.__updateTargetProperty(args.newValue);
    }

    private __source_PropertyChangeEvent: FrameworkEvent<PropertyChangeEventArgs> = new FrameworkEvent(this.__source_onPropertyChange, this);

    private __updateSourceProperty(targetValue: any) {
        const canUpdateToSource = Enumeration.contains(BindingDirection.ToSource, this.direction!);
        if (canUpdateToSource) {
            let newSourceValue: any;
            if (this.valueConverter)
                newSourceValue = this.valueConverter.convertBack(targetValue);
            else
                newSourceValue = targetValue;
            __Storage.trySetValue(this, this.source, this.sourceProperty, newSourceValue);
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
}