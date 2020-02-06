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

function getEntryByProperty(property: DependencyProperty): RegistryEntry | null {
    return registerEntries.find(e => e.property === property) || null;
}

type RegistryContext = {
    target: Class<DependencyObject>,
    subContexts: RegistryContext[],
    superContext: RegistryContext | null,
    storedValue: any,
    hasStoredValue: boolean
}

function createContext(target: Class<DependencyObject>, superContext: RegistryContext | null = null): RegistryContext {
    const context: RegistryContext = {
        target,
        superContext,
        storedValue: null,
        hasStoredValue: false,
        subContexts: []
    }

    if (superContext)
        superContext.subContexts.push(context);

    return context;
}

function* getContextRecursion(context: RegistryContext | null): Generator<RegistryContext> {
    while (context) {
        yield context;
        context = context.superContext;
    }
}

function getContext(property: DependencyProperty, target: Class<DependencyObject>) {
    function getRecursive(context: RegistryContext): RegistryContext | null {
        if (context.target === target)
            return context;
        else {
            for (let subContext of context.subContexts) {
                const target = getRecursive(subContext);
                if (target)
                    return target;
            }
        }
        return null;
    }

    const entry: RegistryEntry | null = getEntryByProperty(property);
    if (entry)
        return getRecursive(entry.mainContext);
    else
        return property.metadata.defaultValue;
}

function storeValue(context: RegistryContext, value: any) {
    context.hasStoredValue = true;
    context.storedValue = value;
}

export function getValue(property: DependencyProperty, target: Class<DependencyObject>) {
    const context = getContext(property, target);
    const recursion = getContextRecursion(context);
    for (const subContext of recursion) {
        if (!subContext.hasStoredValue)
            continue;
        return subContext.storedValue;
    }
    return null;
}

export function setValue(property: DependencyProperty, target: Class<DependencyObject>, value: any) {
    const context = getContext(property, target);
    storeValue(context, value);
}

const registerEntries: Array<RegistryEntry> = new Array();

export function register(target: Class<DependencyObject>, property: DependencyProperty) {
    const mainContext = createContext(target);
    const entry = createRegistryEntry(property, mainContext);
    registerEntries.push(entry);
}

export function override(target: Class<DependencyObject>) {
    
}