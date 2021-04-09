import { Binding, BindingDirection } from "./index.js";
import { DependencyProperty, PropertyChangeEventArgs, PropertyMetadata } from "../../standard/dependency-objects/index.js";
import { assertParams } from "../../validation/index.js";
import { DependencyObject } from "../../standard/dependency-objects/dependency-object.js";
import { FrameworkEvent } from "../../standard/events/index.js";
import { Enumeration } from "../../standard/index.js";
import { IValueConverter } from "../value-converters/index.js";

import * as Storage from "../../standard/dependency-objects/_storage.js";
import { Type } from "../../standard/reflection/index.js";

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
        const canUpdateToTarget = Enumeration.contains(BindingDirection.ToTarget, this.direction!);
        if (canUpdateToTarget) {
            const hasValueConverter = !!this.valueConverter;
            let targetValue: any;
            if (hasValueConverter)
                targetValue = (<IValueConverter>this.valueConverter).convert(sourceValue);
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
        const canUpdateToSource = Enumeration.contains(BindingDirection.ToSource, this.direction!);
        if (canUpdateToSource) {
            const hasValueConverter = !!this.valueConverter;
            let sourceValue: any;
            if (hasValueConverter)
                sourceValue = (<IValueConverter>this.valueConverter).convert(targetValue);
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

    static sourceProperty = DependencyProperty.registerAttachedReadonly(PropertyBinding, "source", new PropertyMetadata(Type.get(DependencyObject)));
    get source(): DependencyObject { return this.get(PropertyBinding.sourceProperty); }

    static sourcePropertyProperty = DependencyProperty.registerAttachedReadonly(PropertyBinding, "sourceProperty", new PropertyMetadata(Type.get(DependencyObject)));
    get sourceProperty(): DependencyProperty { return this.get(PropertyBinding.sourcePropertyProperty); }

    static targetProperty = DependencyProperty.registerAttachedReadonly(PropertyBinding, "target", new PropertyMetadata(Type.get(DependencyObject)));
    get target(): DependencyObject { return this.get(PropertyBinding.targetProperty); }

    static targetPropertyProperty = DependencyProperty.registerAttachedReadonly(PropertyBinding, "targetProperty", new PropertyMetadata(Type.get(DependencyObject)));
    get targetProperty(): DependencyProperty { return this.get(PropertyBinding.targetPropertyProperty); }

    protected destructor(): void {
        this.__source_PropertyChangeEvent.destruct();
        this.__target_PropertyChangeEvent.destruct();
    }
}