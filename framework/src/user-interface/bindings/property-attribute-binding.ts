import { Binding, BindingDirection } from "./index.js";
import { DependencyObject, DependencyProperty, DependencyPropertyKey, PropertyChangeEventArgs, PropertyMetadata } from "../../standard/dependency-objects/index.js";
import { assertParams } from "../../validation/index.js";
import { FrameworkEvent } from "../../standard/events/index.js";
import { Enumeration } from "../../standard/index.js";
import { IValueConverter } from "../value-converters/index.js";
import { Type } from "../../standard/reflection/index.js";
import { _Storage } from "../../standard/dependency-objects/_storage.js";

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

        this.set(PropertyAttributeBinding.__sourcePropertyKey, source);
        this.set(PropertyAttributeBinding.__sourcePropertyPropertyKey, sourceProperty);
        this.set(PropertyAttributeBinding.__targetElementPropertyKey, targetElement);
        this.set(PropertyAttributeBinding.__targetAttributeNamePropertyKey, targetAttributeName);
        this.set(PropertyAttributeBinding.__targetAttributeNamespacePropertyKey, targetAttributeNamespace);

        this.__source_PropertyChangeEvent = new FrameworkEvent(this.__source_onPropertyChange, this);
        source.PropertyChangeEvent.attach(this.__source_PropertyChangeEvent);

        this.__targetElement_attributeMutationObserver = new MutationObserver(this.__targetElement_attributeChange_handler.bind(this));
        this.__targetElement_attributeMutationObserver.observe(targetElement, { attributes: true });

        this.__doInitialUpdate();
    }

    private __updateTargetAttribute(propertyValue: any) {
        const canUpdateToTarget = Enumeration.contains(BindingDirection.ToTarget, this.direction);
        if (canUpdateToTarget) {
            const hasValueConverter = !!this.valueConverter;
            let attributeValue: string | null;
            if (hasValueConverter)
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
            const hasValueConverter = !!this.valueConverter;
            let propertyValue: any;
            if (hasValueConverter)
                propertyValue = (<IValueConverter>this.valueConverter).convertBack(attributeValue);
            else
                propertyValue = attributeValue;

            _Storage.setValue(this, this.source, this.sourceProperty, propertyValue);
        }
    }

    private __doInitialUpdate() {
        const isAttributeSet = this.targetElement.hasAttributeNS(this.targetAttributeNamespace, this.targetAttributeName);
        if (isAttributeSet) {
            const attributeValue = this.targetElement.getAttributeNS(this.targetAttributeNamespace, this.targetAttributeName);
            this.__updateSourceProperty(attributeValue);
        }

        const propertyValue = _Storage.getValue(this.source, this.sourceProperty);
        if (propertyValue !== null)
            this.__updateTargetAttribute(propertyValue);
    }

    private __targetElement_attributeChange_handler(mutations: MutationRecord[]) {
        for (let mutation of mutations) {
            const isTargetAttribute = mutation.type == "attributes" && mutation.attributeName == this.targetAttributeName && mutation.attributeNamespace == this.targetAttributeNamespace;
            if (isTargetAttribute)
                this.__updateSourceProperty(this.targetElement.getAttributeNS(this.targetAttributeNamespace, this.targetAttributeName));
        }
    }

    private __targetElement_attributeMutationObserver: MutationObserver;

    static __sourcePropertyKey: DependencyPropertyKey = DependencyProperty.registerReadonly(PropertyAttributeBinding, "source", new PropertyMetadata(Type.get(DependencyObject)));
    static sourceProperty: DependencyProperty = PropertyAttributeBinding.__sourcePropertyKey.property;
    get source(): DependencyObject { return this.get(PropertyAttributeBinding.sourceProperty); }

    static __sourcePropertyPropertyKey: DependencyPropertyKey = DependencyProperty.registerReadonly(PropertyAttributeBinding, "sourceProperty", new PropertyMetadata(Type.get(DependencyProperty)));
    static sourcePropertyProperty: DependencyProperty = PropertyAttributeBinding.__sourcePropertyPropertyKey.property;
    get sourceProperty(): DependencyProperty { return this.get(PropertyAttributeBinding.sourcePropertyProperty); }

    static __targetElementPropertyKey: DependencyPropertyKey = DependencyProperty.registerReadonly(PropertyAttributeBinding, "targetElement", new PropertyMetadata(Type.get(Element)));
    static targetElementProperty: DependencyProperty = PropertyAttributeBinding.__targetElementPropertyKey.property;
    get targetElement(): Element { return this.get(PropertyAttributeBinding.targetElementProperty); }

    static __targetAttributeNamePropertyKey = DependencyProperty.registerReadonly(PropertyAttributeBinding, "targetAttributeName", new PropertyMetadata(Type.get(String)));
    static targetAttributeNameProperty = PropertyAttributeBinding.__targetAttributeNamePropertyKey.property;
    get targetAttributeName(): string { return this.get(PropertyAttributeBinding.targetAttributeNameProperty); }

    static __targetAttributeNamespacePropertyKey = DependencyProperty.registerReadonly(PropertyAttributeBinding, "targetAttributeNamespace", new PropertyMetadata(null));
    static targetAttributeNamespaceProperty = PropertyAttributeBinding.__targetAttributeNamespacePropertyKey.property;
    get targetAttributeNamespace(): string | null { return this.get(PropertyAttributeBinding.targetAttributeNamespaceProperty); }

    protected destructor(): void {
        this.__source_PropertyChangeEvent.destruct();
        this.__targetElement_attributeMutationObserver.disconnect();
    }
}