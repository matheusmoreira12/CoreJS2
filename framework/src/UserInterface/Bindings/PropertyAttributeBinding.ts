import { Binding, IBindingOptions } from "./index.js";
import { DependencyProperty, PropertyChangeEventArgs } from "../../Standard/DependencyObjects/index.js";
import { assertParams } from "../../Validation/index.js";
import { DependencyObject } from "../../Standard/DependencyObjects/DependencyObject.js";
import { FrameworkEvent } from "../../Standard/Events/index.js";

import * as Storage from "../../Standard/DependencyObjects/_Storage.js";
import { Enumeration } from "../../Standard/index.js";
import { BindingDirection } from "./Bindings.js";
import { IValueConverter } from "../ValueConverters/index.js";
import { Type } from "../../Standard/Types/index.js";

//Keys for PropertyAttributeBinding

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

        this.set(PropertyAttributeBinding.sourceProperty, source);
        this.set(PropertyAttributeBinding.sourcePropertyProperty, sourceProperty);
        this.set(PropertyAttributeBinding.targetElementProperty, targetElement);
        this.set(PropertyAttributeBinding.targetAttributeNameProperty, targetAttributeName);
        this.set(PropertyAttributeBinding.targetAttributeNamespaceProperty, targetAttributeNamespace);

        this.__source_PropertyChangeEvent = new FrameworkEvent(this.__source_onPropertyChange, this);
        source.PropertyChangeEvent.attach(this.__source_PropertyChangeEvent);

        this.__targetElement_attributeMutationObserver = new MutationObserver(this.__targetElement_attributeChange_handler.bind(this));
        this.__targetElement_attributeMutationObserver.observe(targetElement, { attributes: true });

        this.__doInitialUpdate();
    }

    private __updateTargetAttribute(propertyValue: any) {
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

    private __source_onPropertyChange(sender: any, args: PropertyChangeEventArgs) {
        if (args.property === this.sourceProperty)
            this.__updateTargetAttribute(args.newValue);
    }

    private __source_PropertyChangeEvent: FrameworkEvent<PropertyChangeEventArgs>;

    private __updateSourceProperty(attributeValue: string | null) {
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

    private __doInitialUpdate() {
        const isAttributeSet = this.targetElement.hasAttributeNS(this.targetAttributeNamespace, this.targetAttributeName);
        if (isAttributeSet) {
            const attributeValue = this.targetElement.getAttributeNS(this.targetAttributeNamespace, this.targetAttributeName);
            this.__updateSourceProperty(attributeValue);
        }

        const propertyValue = Storage.getValue(this.source, this.sourceProperty);
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

    static sourceProperty = DependencyProperty.registerReadonly(PropertyAttributeBinding, "source", { valueType: Type.get(DependencyObject) });
    get source(): DependencyObject { return this.get(PropertyAttributeBinding.sourceProperty); }

    static sourcePropertyProperty = DependencyProperty.registerReadonly(PropertyAttributeBinding, "sourceProperty", { valueType: Type.get(DependencyProperty) });
    get sourceProperty(): DependencyProperty { return this.get(PropertyAttributeBinding.sourcePropertyProperty); }

    static targetElementProperty = DependencyProperty.registerReadonly(PropertyAttributeBinding, "targetElement", { valueType: Type.get(Element) });
    get targetElement(): Element { return this.get(PropertyAttributeBinding.targetElementProperty); }

    static targetAttributeNameProperty = DependencyProperty.registerReadonly(PropertyAttributeBinding, "targetAttributeName", { valueType: Type.get(String) });
    get targetAttributeName(): string { return this.get(PropertyAttributeBinding.targetAttributeNameProperty); }

    static targetAttributeNamespaceProperty = DependencyProperty.registerReadonly(PropertyAttributeBinding, "targetAttributeNamespace");
    get targetAttributeNamespace(): string | null { return this.get(PropertyAttributeBinding.targetAttributeNamespaceProperty); }

    protected destructor(): void {
        this.__source_PropertyChangeEvent.destruct();
        this.__targetElement_attributeMutationObserver.disconnect();
    }
}