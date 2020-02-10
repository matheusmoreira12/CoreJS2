import { DependencyObject } from "./DependencyObject";
import { DependencyProperty } from "./DependencyProperty";
import { PropertyMetadata } from "./PropertyMetadata";
import { InvalidOperationException } from "../Exceptions";
import { PropertyChangeEventArgs } from "./PropertyChangeEvent";

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

    storeValue(property: DependencyProperty, value: any) {
        const propertyStorage = this.propertyStorages.find(sv => sv.property === property);
        if (propertyStorage)
            propertyStorage.value = value;
    }

    *getChangedContexts(property: DependencyProperty, value: any): Generator<RegistryContext> {
        const oldValue = this.retrieveValue(property);
        if (oldValue === null || value !== oldValue)
            yield this;

        for (let subContext of this.subContexts)
            yield* subContext.getChangedContexts(property, value);
    }

    retrieveValue(property: DependencyProperty): any {
        let context: RegistryContext | null = this;
        while (context) {
            const propertyStorage = this.propertyStorages.find(sv => sv.property === property);
            if (propertyStorage) {
                if (propertyStorage.hasValue)
                    return propertyStorage.value;
                else
                    return propertyStorage.metadata.defaultValue;
            }
            context = context.superContext;
        }
        return null;
    }

    targetClass: Class<DependencyObject> | null;
    targetInstance: DependencyObject | null;
    subContexts: RegistryContext[];
    superContext: RegistryContext | null;
    propertyStorages: PropertyStorage[];
}

const allContexts: Array<RegistryContext> = new Array();

function getContext(target: DependencyObject): RegistryContext | null {
    function getInstanceContext() {
        while (target) {
            const context = allContexts.find(c => c.targetInstance === target);
            if (context)
                return context;
            //Move to target ancestor
            target = Object.getPrototypeOf(target);
        }
        return null;
    }

    function getRootContext() {
        allContexts.find(c => c.targetClass && target instanceof c.targetClass);
    }

    return getInstanceContext() || getRootContext() || null;
}

export function getValue(property: DependencyProperty, target: DependencyObject): any {
    const context = getContext(target);
    if (context)
        return context.retrieveValue(property);
    else
        throw new InvalidOperationException("Cannot get property value.")
}

export function setValue(property: DependencyProperty, target: DependencyObject, value: any) {
    const context = getContext(target);
    if (context) {
        const changedContexts = context.getChangedContexts(property, value);
        for (let changedContext of changedContexts) {
            const oldValue = changedContext.retrieveValue(property);
            if (changedContext.targetInstance)
                changedContext.targetInstance.__invoke_onPropertyChange(new PropertyChangeEventArgs(target, property, oldValue, value));
        }
        context.storeValue(property, value)
        return;
    }
    throw new InvalidOperationException("Cannot set property value.");
}


export function register(target: Class<DependencyObject>, property: DependencyProperty, metadata: PropertyMetadata) {
    const context = RegistryContext.createByClass(target);
    context.registerProperty(property, metadata);

    allContexts.push(context);
}

export function overrideContext(target: DependencyObject) {
    const superContext = getContext(target);
    if (superContext) {
        const subContext = RegistryContext.createByInstance(target);
        superContext.adoptSubContext(subContext);
    }
    else
        throw new InvalidOperationException("Cannot override context. No super-context found to override from.");
}