import { Binding, IBindingOptions } from "./index";
import { DependencyProperty, PropertyChangeEventArgs } from "../DependencyObjects/index";
import { assertParams } from "../../Validation/index";
import { DependencyObject } from "../DependencyObjects/DependencyObject";
import { FrameworkEvent, FrameworkEventArgs } from "../../Standard/Events/index";

import * as Storage from "../DependencyObjects/Storage";
import { Enumeration } from "../../Standard/index";
import { BindingDirection } from "./Bindings";

//Keys for PropertyAttributeBinding
const $source = Symbol();
const $sourceProperty = Symbol();
const $targetElement = Symbol();
const $targetAttributeName = Symbol();
const $targetAttributeNamespace = Symbol();

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

        this.__source_PropertyChangeEvent = new FrameworkEvent(this.__source_onPropertyChange, this);
        source.PropertyChangeEvent.attach(this.__source_PropertyChangeEvent);

        this.__targetElement_attributeMutationObserver = new MutationObserver(this.__targetElement_attributeChange_handler.bind(this));
        this.__targetElement_attributeMutationObserver.observe(targetElement, { attributes: true });

        this.__doInitialUpdate();
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

    private __updateTargetAttribute(propertyValue: any) {
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

    private __source_onPropertyChange(sender: any, args: PropertyChangeEventArgs) {
        if (args.property === this.sourceProperty)
            this.__updateTargetAttribute(args.newValue);
    }

    private __source_PropertyChangeEvent: FrameworkEvent<PropertyChangeEventArgs>;

    private __updateSourceProperty(attributeValue: string | null) {
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

    private __doInitialUpdate() {
        const attributeValue = this.targetElement.getAttributeNS(this.targetAttributeNamespace, this.targetAttributeName);
        this.__updateSourceProperty(attributeValue);

        const propertyValue = Storage.getValue(this.source, this.sourceProperty);
        this.__updateTargetAttribute(propertyValue);
    }

    private __targetElement_attributeChange_handler(mutations: MutationRecord[]) {
        for (let mutation of mutations) {
            if (mutation.type == "attributes" && mutation.attributeName == this.targetAttributeName && mutation.attributeNamespace == this.targetAttributeNamespace)
                this.__updateSourceProperty(this.targetElement.getAttributeNS(this.targetAttributeNamespace, this.targetAttributeName));
        }
    }

    private __targetElement_attributeMutationObserver: MutationObserver;

    protected destructor(): void {
        this.__source_PropertyChangeEvent.destruct();
        this.__targetElement_attributeMutationObserver.disconnect();
    }
}