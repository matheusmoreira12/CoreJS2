import { Binding, BindingDirection } from "./index.js";
import { DependencyObject, DependencyProperty, DependencyPropertyKey, PropertyChangeEventArgs, PropertyMetadata } from "../../standard/dependency-objects/index.js";
import { assertParams } from "../../validation/index.js";
import { FrameworkEvent } from "../../standard/events/index.js";
import { Enumeration } from "../../standard/index.js";
import { IValueConverter } from "../value-converters/index.js";
import { Type } from "../../standard/reflection/index.js";
import { __Storage } from "../../standard/dependency-objects/__storage.js";

/**
 * PropertyAttributeBinding class
 * Allows the binding of an attribute to a framework property.
 */
export class PropertyAttributeBinding extends Binding {
    constructor(source: DependencyObject, sourceProperty: DependencyProperty, targetElement: Element, targetAttributeName: string, targetAttributeNamespace: string | null = null, direction: number = BindingDirection.Both, valueConverter: IValueConverter) {
        super(direction, valueConverter);

        assertParams({ source }, [DependencyObject]);
        assertParams({ sourceProperty }, [DependencyProperty]);
        assertParams({ targetElement }, [Element]);
        assertParams({ targetAttributeName }, [String]);
        assertParams({ targetAttributeNamespace }, [String, null]);

        this.__source = source;
        this.__sourceProperty = sourceProperty;
        this.__targetElement = targetElement;
        this.__targetAttributeName = targetAttributeName;
        this.__targetAttributeNamespace = targetAttributeNamespace;

        this.__source_PropertyChangeEvent = new FrameworkEvent(this.__source_onPropertyChange, this);
        source.PropertyChangeEvent.attach(this.__source_PropertyChangeEvent);

        this.__targetElement_attributeMutationObserver = new MutationObserver(this.__targetElement_attributeMutationObserver_handler.bind(this));
        this.__targetElement_attributeMutationObserver.observe(targetElement, { attributes: true });

        this.__doInitialUpdate();
    }

    private __updateTargetAttribute(propertyValue: any) {
        const canUpdateToTarget = Enumeration.contains(BindingDirection.ToTarget, this.direction);
        if (canUpdateToTarget) {
            let attributeValue: string | null;
            if (this.valueConverter)
                attributeValue = (<IValueConverter>this.valueConverter).convert(propertyValue);
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
        const canUpdateToSource = Enumeration.contains(BindingDirection.ToSource, this.direction);
        if (canUpdateToSource) {
            let propertyValue: any;
            if (this.valueConverter)
                propertyValue = (<IValueConverter>this.valueConverter).convertBack(attributeValue);
            else
                propertyValue = attributeValue;

            __Storage.trySetValue(this, this.source, this.sourceProperty, propertyValue);
        }
    }

    private __doInitialUpdate() {
        const isAttributeSet = this.targetElement.hasAttributeNS(this.targetAttributeNamespace, this.targetAttributeName);
        if (isAttributeSet) {
            const attributeValue = this.targetElement.getAttributeNS(this.targetAttributeNamespace, this.targetAttributeName);
            this.__updateSourceProperty(attributeValue);
        }

        const propertyValue = this.source.get(this.sourceProperty);
        if (propertyValue !== null)
            this.__updateTargetAttribute(propertyValue);
    }

    private __targetElement_attributeMutationObserver_handler(mutations: MutationRecord[]) {
        for (let mutation of mutations) {
            if (mutation.type != "attributes" ||
                mutation.attributeName != this.targetAttributeName ||
                mutation.attributeNamespace != this.targetAttributeNamespace)
                continue;
            this.__updateSourceProperty(this.targetElement.getAttributeNS(this.targetAttributeNamespace, this.targetAttributeName));
        }
    }

    private __targetElement_attributeMutationObserver: MutationObserver;

    get source(): DependencyObject { return this.__source; }
    private __source: DependencyObject;

    get sourceProperty(): DependencyProperty { return this.__sourceProperty; }
    private __sourceProperty: DependencyProperty;

    get targetElement(): Element { return this.__targetElement; }
    private __targetElement: Element;

    get targetAttributeName(): string { return this.__targetAttributeName; }
    private __targetAttributeName: string;

    get targetAttributeNamespace(): string | null { return this.__targetAttributeNamespace; }
    private __targetAttributeNamespace: string | null;

    protected destructor(): void {
        this.__source_PropertyChangeEvent.destruct();
        this.__targetElement_attributeMutationObserver.disconnect();
    }
}