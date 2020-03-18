import { Binding, IBindingOptions } from "./index";
import { DependencyProperty, PropertyChangeEventArgs } from "../DependencyObjects/index";
import { assertParams } from "../../Validation/index";
import { DependencyObject } from "../DependencyObjects/DependencyObject";
import { FrameworkEvent } from "../../Standard/Events/index";

import * as Storage from "../DependencyObjects/Storage";
import { Enumeration } from "../../Standard/index";
import { BindingDirection } from "./Bindings";
import { IValueConverter } from "../ValueConverters/index";

//Keys for PropertyAttributeBinding
const $source = Symbol("source");
const $source_PropertyChangeEvent = Symbol("source_PropertyChangeEvent");
const $source_onPropertyChange = Symbol("source_onPropertyChange");
const $sourceProperty = Symbol("sourceProperty");
const $targetElement = Symbol("targetElement");
const $targetElement_attributeMutationObserver = Symbol("targetElement_attributeMutationObserver");
const $targetElement_attributeChange_handler = Symbol("targetElement_attributeChange_handler");
const $targetAttributeName = Symbol("targetAttributeName");
const $targetAttributeNamespace = Symbol("targetAttributeNamespace");
const $doInitialUpdate = Symbol("doInitialUpdate");
const $updateSourceProperty = Symbol("updateSourceProperty");
const $updateTargetAttribute = Symbol("updateTargetAttribute");

/**
 * PropertyAttributeBinding class
 * Allows the binding of an attribute to a framework property.
 */
export class PropertyAttributeBinding extends Binding {
    constructor(source: DependencyObject, sourceProperty: DependencyProperty, targetElement: Element, targetAttributeName: string, targetAttributeNamespace: string | null = null, options?: IBindingOptions) {
        super(options);

        assertParams({ source }, [DependencyObject]);
        assertParams({ sourceProperty }, [DependencyProperty]);
        assertParams({ targetElement }, [Element]);
        assertParams({ targetAttributeName }, [String]);
        assertParams({ targetAttributeNamespace }, [String, null]);

        this[$source] = source;
        this[$sourceProperty] = sourceProperty;
        this[$targetElement] = targetElement;
        this[$targetAttributeName] = targetAttributeName;
        this[$targetAttributeNamespace] = targetAttributeNamespace;

        this[$source_PropertyChangeEvent] = new FrameworkEvent(this[$source_onPropertyChange], this);
        source.PropertyChangeEvent.attach(this[$source_PropertyChangeEvent]);

        this[$targetElement_attributeMutationObserver] = new MutationObserver(this[$targetElement_attributeChange_handler].bind(this));
        this[$targetElement_attributeMutationObserver].observe(targetElement, { attributes: true });

        this[$doInitialUpdate]();
    }

    private [$updateTargetAttribute](propertyValue: any) {
        const canUpdateToTarget = Enumeration.contains(BindingDirection.ToTarget, this.options.direction || 0);
        if (canUpdateToTarget) {
            const hasValueConverter = !!this.options.valueConverter;
            let attributeValue: string | null;
            if (hasValueConverter)
                attributeValue = (<IValueConverter>this.options.valueConverter).convert(propertyValue);
            else
                attributeValue = String(propertyValue);

            if (attributeValue === null)
                this.targetElement.removeAttributeNS(this.targetAttributeNamespace, this.targetAttributeName);
            else
                this.targetElement.setAttributeNS(this.targetAttributeNamespace, this.targetAttributeName, attributeValue);
        }
    }

    private [$source_onPropertyChange](sender: any, args: PropertyChangeEventArgs) {
        if (args.property === this.sourceProperty)
            this[$updateTargetAttribute](args.newValue);
    }

    private [$source_PropertyChangeEvent]: FrameworkEvent<PropertyChangeEventArgs>;

    private [$updateSourceProperty](attributeValue: string | null) {
        const canUpdateToSource = Enumeration.contains(BindingDirection.ToSource, this.options.direction || 0);
        if (canUpdateToSource) {
            const hasValueConverter = !!this.options.valueConverter;
            let propertyValue: any;
            if (hasValueConverter)
                propertyValue = (<IValueConverter>this.options.valueConverter).convertBack(attributeValue);
            else
                propertyValue = attributeValue;

            Storage.setValue(this, this.source, this.sourceProperty, propertyValue);
        }
    }

    private [$doInitialUpdate]() {
        const isAttributeSet = this.targetElement.hasAttributeNS(this.targetAttributeNamespace, this.targetAttributeName);
        if (isAttributeSet) {
            const attributeValue = this.targetElement.getAttributeNS(this.targetAttributeNamespace, this.targetAttributeName);
            this[$updateSourceProperty](attributeValue);
        }

        const propertyValue = Storage.getValue(this.source, this.sourceProperty);
        if (propertyValue !== null)
            this[$updateTargetAttribute](propertyValue);
    }

    private [$targetElement_attributeChange_handler](mutations: MutationRecord[]) {
        for (let mutation of mutations) {
            const isTargetAttribute = mutation.type == "attributes" && mutation.attributeName == this.targetAttributeName && mutation.attributeNamespace == this.targetAttributeNamespace;
            if (isTargetAttribute)
                this[$updateSourceProperty](this.targetElement.getAttributeNS(this.targetAttributeNamespace, this.targetAttributeName));
        }
    }

    private [$targetElement_attributeMutationObserver]: MutationObserver;

    get source(): DependencyObject { return this[$source]; }
    private [$source]: DependencyObject;

    get sourceProperty(): DependencyProperty { return this[$sourceProperty]; }
    private [$sourceProperty]: DependencyProperty;

    get targetElement(): Element { return this[$targetElement]; }
    private [$targetElement]: Element;

    get targetAttributeName(): string { return this[$targetAttributeName]; }
    private [$targetAttributeName]: string;

    get targetAttributeNamespace(): string | null { return this[$targetAttributeNamespace]; }
    private [$targetAttributeNamespace]: string | null;

    protected destructor(): void {
        this[$source_PropertyChangeEvent].destruct();
        this[$targetElement_attributeMutationObserver].disconnect();
    }
}