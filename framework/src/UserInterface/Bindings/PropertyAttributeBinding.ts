import { Binding, IBindingOptions } from "./index";
import { DependencyProperty, PropertyChangeEventArgs } from "../DependencyObjects/index";
import { assertParams } from "../../Validation/index";
import { DependencyObject } from "../DependencyObjects/DependencyObject";
import { FrameworkEvent } from "../../Standard/Events/index";

import * as Storage from "../DependencyObjects/Storage";
import { Enumeration } from "../../Standard/index";
import { BindingDirection } from "./Bindings";

//Keys for PropertyAttributeBinding
const $source = Symbol();
const $source_PropertyChangeEvent = Symbol();
const $source_onPropertyChange = Symbol();
const $sourceProperty = Symbol();
const $targetElement = Symbol();
const $targetElement_attributeMutationObserver = Symbol();
const $targetElement_attributeChange_handler = Symbol();
const $targetAttributeName = Symbol();
const $targetAttributeNamespace = Symbol();
const $doInitialUpdate = Symbol();
const $updateSourceProperty = Symbol();
const $updateTargetAttribute = Symbol();

/**
 * PropertyAttributeBinding class
 * Allows the binding of an attribute to a framework property.
 */
export class PropertyAttributeBinding extends Binding {
    constructor(source: DependencyObject, sourceProperty: DependencyProperty, targetElement: Element, targetAttributeName: string, targetAttributeNamespace: string | null = null, options?: IBindingOptions) {
        super(options);

        assertParams({ source }, DependencyObject);
        assertParams({ sourceProperty }, DependencyProperty);
        assertParams({ targetElement }, Element);
        assertParams({ targetAttributeName }, String);
        assertParams({ targetAttributeNamespace }, String, null);

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

    private [$updateTargetAttribute](propertyValue: any) {
        const canUpdateToTarget = Enumeration.contains(BindingDirection.ToTarget, this.options.direction || 0);
        if (canUpdateToTarget) {
            let attributeValue: string | null;
            if (this.options.valueConverter)
                attributeValue = this.options.valueConverter.convert(propertyValue);
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
            let propertyValue: any;
            if (this.options.valueConverter)
                propertyValue = this.options.valueConverter.convertBack(propertyValue);
            else
                propertyValue = attributeValue;

            if (propertyValue === null)
                Storage.unsetValue(this, this.source, this.sourceProperty);
            else
                Storage.setValue(this, this.source, this.sourceProperty, propertyValue);
        }
    }

    private [$doInitialUpdate]() {
        if (this.targetElement.hasAttributeNS(this.targetAttributeNamespace, this.targetAttributeName)) {
            const attributeValue = this.targetElement.getAttributeNS(this.targetAttributeNamespace, this.targetAttributeName);
            this[$updateSourceProperty](attributeValue);
        }

        const propertyValue = Storage.getValue(this.source, this.sourceProperty);
        this[$updateTargetAttribute](propertyValue);
    }

    private [$targetElement_attributeChange_handler](mutations: MutationRecord[]) {
        for (let mutation of mutations) {
            if (mutation.type == "attributes" && mutation.attributeName == this.targetAttributeName && mutation.attributeNamespace == this.targetAttributeNamespace)
                this[$updateSourceProperty](this.targetElement.getAttributeNS(this.targetAttributeNamespace, this.targetAttributeName));
        }
    }

    private [$targetElement_attributeMutationObserver]: MutationObserver;

    protected destructor(): void {
        this[$source_PropertyChangeEvent].destruct();
        this[$targetElement_attributeMutationObserver].disconnect();
    }
}