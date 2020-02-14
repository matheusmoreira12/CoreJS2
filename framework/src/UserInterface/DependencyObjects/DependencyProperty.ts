import { PropertyMetadata } from "./PropertyMetadata";
import { DependencyObject } from "./DependencyObject";
import { DataContext } from "../DataContexts/index";
import { assertParams } from "../../Validation/index";
import * as Storage from "./Storage";

const $unsetValue = Symbol("unset");

//Keys for DependencyProperty
const $id = Symbol();

/**
 * Eases the integration between user-defined properties and framework features.
 */
export class DependencyProperty {
    static get unsetValue(): symbol { return $unsetValue; }

    static register(target: typeof DependencyObject, name: string, metadata: PropertyMetadata): DependencyProperty {
        assertParams({ name }, String);
        assertParams({ metadata }, PropertyMetadata);

        return registerProperty(target, name, metadata);
    }

    static overrideMetadata(target: typeof DependencyObject, metadata: PropertyMetadata) {
        assertParams({ metadata }, PropertyMetadata);

        overrideTargetMetadata(target, metadata);
    }

    constructor(id: number) {
        assertParams({ id }, Number);

        this[$id] = id;
    }

    get id(): number { return this[$id]; }
    private [$id]: number;
}

function registerProperty(target: typeof DependencyObject, name: string, metadata: PropertyMetadata): DependencyProperty {
    const context = DataContext.getOrCreate(target);
    const property = new DependencyProperty(0);
    return property;
}

function* getParentTargets(target: typeof DependencyObject): Generator<typeof DependencyObject> {
    while (target) {
        target = Object.getPrototypeOf(target);
        yield target;
    }
}

function* getParentContexts(target: typeof DependencyObject): Generator<DataContext> {
    for (let parentTarget of getParentTargets(target)) {
        const context = DataContext.get(parentTarget);
        if (context)
            yield context;
    }
}

function overrideTargetMetadata(target: typeof DependencyObject, metadata: PropertyMetadata) {
    for (let parentContext of getParentContexts(target)) {
        
    }
}