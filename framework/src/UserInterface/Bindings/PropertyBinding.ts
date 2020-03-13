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
const $source_PropertyChangeEvent = Symbol();
const $source_onPropertyChange = Symbol();
const $sourceProperty = Symbol();
const $updateSourceProperty = Symbol();
const $target = Symbol();
const $target_PropertyChangeEvent = Symbol();
const $target_onPropertyChange = Symbol();
const $targetProperty = Symbol();
const $updateTargetProperty = Symbol();
const $doInitialCrossingUpdate = Symbol();

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

        this[$source] = source;
        this[$sourceProperty] = sourceProperty;
        this[$target] = target;
        this[$targetProperty] = targetProperty;

        this[$source_PropertyChangeEvent] = new FrameworkEvent(this[$source_onPropertyChange], this);
        source.PropertyChangeEvent.attach(this[$source_PropertyChangeEvent]);
        this[$target_PropertyChangeEvent] = new FrameworkEvent(this[$target_onPropertyChange], this);
        target.PropertyChangeEvent.attach(this[$target_PropertyChangeEvent]);

        this[$doInitialCrossingUpdate]();
    }

    private [$doInitialCrossingUpdate]() {
        const sourcePropertyRawValue = Storage.getRawValue(this.source, this.sourceProperty);
        this[$updateTargetProperty](sourcePropertyRawValue);

        const targetPropertyRawValue = Storage.getRawValue(this.target, this.targetProperty);
        this[$updateSourceProperty](targetPropertyRawValue);
    }

    private [$updateTargetProperty](sourceValue: any) {
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

    private [$source_onPropertyChange](sender: any, args: PropertyChangeEventArgs) {
        const isSourceProperty = args.property === this.sourceProperty;
        if (isSourceProperty) {
            const sourcePropertyRawValue = Storage.getRawValue(this.target, this.targetProperty);
            this[$updateTargetProperty](sourcePropertyRawValue);
        }
    }

    private [$source_PropertyChangeEvent]: FrameworkEvent<PropertyChangeEventArgs>;

    private [$updateSourceProperty](targetValue: any) {
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

    private [$target_onPropertyChange](sender: any, args: PropertyChangeEventArgs) {
        const isTargetProperty = args.property === this.sourceProperty;
        if (isTargetProperty) {
            const targetPropertyRawValue = Storage.getRawValue(this.target, this.targetProperty);
            this[$updateSourceProperty](targetPropertyRawValue);
        }
    }

    private [$target_PropertyChangeEvent]: FrameworkEvent<PropertyChangeEventArgs>;

    get source(): DependencyObject { return this[$source]; }
    private [$source]: DependencyObject;

    get sourceProperty(): DependencyProperty { return this[$sourceProperty]; }
    private [$sourceProperty]: DependencyProperty;

    get target(): DependencyObject { return this[$target]; }
    private [$target]: DependencyObject;

    get targetProperty(): DependencyProperty { return this[$targetProperty]; }
    private [$targetProperty]: DependencyProperty;

    protected destructor(): void {
        this[$source_PropertyChangeEvent].destruct();
        this[$target_PropertyChangeEvent].destruct();
    }
}