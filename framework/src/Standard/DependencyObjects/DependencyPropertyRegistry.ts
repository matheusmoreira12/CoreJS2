import { DependencyObject } from "./DependencyObject";
import { DependencyProperty } from "./DependencyProperty";
import { PropertyMetadata } from "./PropertyMetadata";
import { InvalidOperationException } from "../Exceptions";

type Class<T> = new () => T;

type PropertyStorage = {
    property: DependencyProperty,
    metadata: PropertyMetadata,
    value: any,
    hasValue: boolean
};

function createPropertyStorage(property: DependencyProperty, metadata: PropertyMetadata): PropertyStorage {
    return {
        property,
        metadata,
        value: null,
        hasValue: false
    };
}

class RegistryContext {
    static createByInstance(targetInstance: DependencyObject): RegistryContext {
        const context = new RegistryContext();
        context.targetInstance = targetInstance;
        return context;
    }

    static createByClass(targetClass: Class<DependencyObject>) {
        const context = new RegistryContext();
        context.targetClass = targetClass;
        return context;
    }

    constructor() {
        this.targetClass = null;
        this.targetInstance = null;
        this.superContext = null;
        this.subContexts = [];
        this.propertyStorages = [];
    }

    adoptSubContext(subContext: RegistryContext) {
        subContext.superContext = this;
        subContext.importProperties(this);
        
        this.subContexts.push(subContext);
    }

    registerProperty(property: DependencyProperty, metadata: any) {
        const propertyStorage = createPropertyStorage(property, metadata);
        this.propertyStorages.push(propertyStorage);
    }

    importProperties(originalContext: RegistryContext) {
        const copiedProperties = originalContext.propertyStorages.map(ps => createPropertyStorage(ps.property, ps.metadata));
        this.propertyStorages.push(...copiedProperties);
    }

    tryStoreValue(property: DependencyProperty, value: any): boolean {
        const propertyStorage = this.propertyStorages.find(sv => sv.hasValue);
        if (propertyStorage) {
            propertyStorage.value = value;
            return true;
        }
        else
            return false;
    }

    tryRetrieveValue(property: DependencyProperty, { value }: { value: any }) {
        let context: RegistryContext | null = this;
        while (context) {
            const propertyStorage = this.propertyStorages.find(sv => sv.hasValue);
            if (propertyStorage) {
                if (propertyStorage.hasValue)
                    value = propertyStorage.value;
                else
                    value = propertyStorage.metadata.defaultValue;
                return true;
            }
            context = context.superContext;
        }
        return false;
    }

    targetClass: Class<DependencyObject> | null;
    targetInstance: DependencyObject | null;
    subContexts: RegistryContext[];
    superContext: RegistryContext | null;
    propertyStorages: PropertyStorage[];
}

const allContexts: Array<RegistryContext> = new Array();

function getContext(target: DependencyObject) {
    return allContexts.find(c => c.targetInstance === target) || allContexts.find(c => c.targetClass && target instanceof c.targetClass);
}

export function getValue(property: DependencyProperty, target: DependencyObject): any {
    const context = getContext(target);
    if (context) {
        let value: any;
        if (context.tryRetrieveValue(property, { value }))
            return value;
    }
    throw new InvalidOperationException("Cannot get property value.")
}

export function setValue(property: DependencyProperty, target: DependencyObject, value: any) {
    const context = getContext(target);
    if (context) {
        if (context.tryStoreValue(property, value))
            return;
    }
    throw new InvalidOperationException("Cannot set property value.")
}

export function register(target: Class<DependencyObject>, property: DependencyProperty, metadata: PropertyMetadata) {
    const context = RegistryContext.createByClass(target);
    context.registerProperty(property, metadata);

    allContexts.push(context);
}

export function override(target: DependencyObject) {
}