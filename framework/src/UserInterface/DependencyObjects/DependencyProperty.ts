import { PropertyMetadata } from "./PropertyMetadata";
import { DependencyObject } from "./DependencyObject";
import { DataContext } from "../DataContexts/index";
import { assertParams } from "../../Validation/index";
import { DependencyDataContext } from "./Storage/DependencyDataContext";
import { ArrayUtils } from "../../CoreBase/Utils/index";
import { InvalidOperationException } from "../../Standard/index";

//Keys for PropertyMetadata
export const $setProperty = Symbol();

//Keys for DependencyProperty
const $unsetValue = Symbol("unset");
const $id = Symbol();

/**
 * Eases the integration between user-defined properties and framework features.
 */
export class DependencyProperty {
    static get unsetValue(): symbol { return $unsetValue; }

    static register(target: typeof DependencyObject, metadata: PropertyMetadata): DependencyProperty {
        assertParams({ name }, String);
        assertParams({ metadata }, PropertyMetadata);

        return registerProperty(target, metadata);
    }

    get id(): number { return this[$id]; }
    private [$id]: number;
}

function* getParentTargets(target: typeof DependencyObject): Generator<typeof DependencyObject> {
    while (target) {
        target = Object.getPrototypeOf(target);
        yield target;
    }
}

function* getParentTargetContexts(target: typeof DependencyObject): Generator<DataContext> {
    for (let parentTarget of getParentTargets(target)) {
        const context = DataContext.main.find(c => c.target === parentTarget);
        if (context)
            yield context;
    }
}

function getOrCreateContextFor(target: typeof DependencyObject) {
    let context = ArrayUtils.getFirst(getParentTargetContexts(target)) as DependencyDataContext | undefined;
    if (context === undefined) {
        context = new DependencyDataContext(target);
        DataContext.main.children.add(context);
    }
    return context;
}

function registerProperty(target: typeof DependencyObject, metadata: PropertyMetadata): DependencyProperty {
    const context = getOrCreateContextFor(target);
    const property = new DependencyProperty();
    metadata[$setProperty](property); //Set the metadata property
    context.metadata.add(metadata); //Add to context
    return property;
}

function overrideTargetMetadata(target: typeof DependencyObject, metadata: PropertyMetadata) {
    const oldContext = ArrayUtils.getFirst(getParentTargetContexts(target)) as DependencyDataContext | undefined;
    if (oldContext !== undefined) {
        const newContext = oldContext.branchOut(target);
        return newContext;
    }
    throw new InvalidOperationException();
}