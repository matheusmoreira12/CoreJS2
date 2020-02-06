import { DependencyObject } from "./DependencyObject";
import { DependencyProperty } from "./DependencyProperty";

type Class<T> = new () => T;

type RegistryEntry = {
    property: DependencyProperty,
    mainContext: RegistryContext
};

function createRegistryEntry(property: DependencyProperty, mainContext: RegistryContext): RegistryEntry {
    return {
        property,
        mainContext
    }
}

type RegistryContext = {
    target: Class<DependencyObject>,
    subContexts: RegistryContext[],
    superContext: RegistryContext | null,
    storedValue: any,
    hasStoredValue: boolean
}

function createContext(target: Class<DependencyObject>, superContext = null): RegistryContext {
    return {
        target,
        superContext,
        storedValue: null,
        hasStoredValue: false,
        subContexts: []
    }
}

function addSubContext(superContext: RegistryContext, context: RegistryContext) {
    superContext.subContexts.push(context);
    context.superContext = superContext;
    return context;
}

const registered: Array<RegistryEntry> = new Array();

export const DependencyPropertyRegistry = {
    register(target: Class<DependencyObject>, property: DependencyProperty) {
        const entry: RegistryEntry = {
            property: property
        };

        registered.
    }
}