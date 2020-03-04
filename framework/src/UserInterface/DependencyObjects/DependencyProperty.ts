import { PropertyMetadata } from "./PropertyMetadata";
import { assertParams } from "../../Validation/index";
import { DataContexts } from "../index";
import { DataContext } from "../DataContexts/index";
import { DependencyDataContext } from "./Storage/index";
import { InvalidOperationException } from "../../Standard/index";
import { FrameworkEvent } from "../../Standard/Events/index";
import { PropertyChangeEventArgs } from "./PropertyChangeEvent";

//Define an arbitrary unset value for the dependency properties
const UNSET_VALUE = {};

//Create a root context for dependency management
const DEPENDENCY_ROOT_CONTEXT = new DataContext(null);
DataContext.root.children.add(DEPENDENCY_ROOT_CONTEXT);

const PropertyChangeEvent: FrameworkEvent<PropertyChangeEventArgs> = new FrameworkEvent();

//Keys for DependencyProperty
const $id = Symbol();

/**
 * Eases the integration between user-defined properties and framework features.
 */
export class DependencyProperty {
    static get unsetValue() { return UNSET_VALUE; }

    static overrideContext(target: typeof Object) {
        assertParams({ target }, Function);

        overrideDependencyContext(target);
    }

    static register(target: typeof Object, metadata: PropertyMetadata): DependencyProperty {
        assertParams({ target }, Function);
        assertParams({ metadata }, PropertyMetadata);

        return registerProperty(target, metadata);
    }

    static getValue(target: object, property: DependencyProperty): any {
        assertParams({ target }, Object);
        assertParams({ property }, DependencyProperty);

        return getPropertyValue(target, property);
    }

    static setValue(target: object, property: DependencyProperty, value: any) {
        assertParams({ target }, Object);
        assertParams({ property }, DependencyProperty);

        setPropertyValue(target, property, value);
    }

    static get ChangeEvent(): FrameworkEvent<PropertyChangeEventArgs> { return PropertyChangeEvent; }

    get id(): number { return this[$id]; }
    private [$id]: number;
}

function overrideDependencyContext(target: typeof Object) {
    let context = DataContexts.Utils.getNearest(DEPENDENCY_ROOT_CONTEXT, target) as DependencyDataContext | null;
    const newContext = new DependencyDataContext(target);
    if (context)
        context.children.add(newContext);
    else
        DEPENDENCY_ROOT_CONTEXT.children.add(newContext);
}

function registerProperty(target: typeof Object, metadata: PropertyMetadata): DependencyProperty {
    const context = DataContexts.Utils.getNearest(DataContext.root, target) as DependencyDataContext | null;
    if (context) {
        const property = new DependencyProperty();
        context.overrideMetadata(property, metadata);
        return property;
    }
    else
        throw new InvalidOperationException("Cannot register dependency property. No dependency data context corresponds to the provided target.");
}

function getPropertyValue(target: object, property: DependencyProperty): any {
    const context = DataContexts.Utils.getNearest(DataContext.root, target.constructor) as DependencyDataContext | null;
    if (context)
        return context.getValue(property, target);
    else
        throw new InvalidOperationException("Cannot get property value. No dependency data context corresponds to the provided target.");
}

function setPropertyValue(target: object, property: DependencyProperty, value: any): void {
    const context = DataContexts.Utils.getNearest(DataContext.root, target.constructor) as DependencyDataContext | null;
    if (context)
        context.setValue(target, target, property, value);
    else
        throw new InvalidOperationException("Cannot set property value. No dependency data context corresponds to the provided target.");
}