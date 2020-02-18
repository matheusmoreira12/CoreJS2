import { PropertyMetadata } from "./PropertyMetadata";
import { DependencyObject } from "./DependencyObject";
import { assertParams } from "../../Validation/index";
import { DataContexts } from "../index";
import { DataContext } from "../DataContexts/index";
import { DependencyDataContext } from "./Storage/index";
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


function registerProperty(target: typeof DependencyObject, metadata: PropertyMetadata): DependencyProperty {
    const context = DataContexts.Utils.getNearest(DataContext.main, target) as DependencyDataContext | null;
    if (context === null)
        throw new InvalidOperationException("Cannot register dependency property. No dependency data context corresponds to the provided target.");
    else
    {
        const property = new DependencyProperty();
        context.overrideMetadata(property, metadata);
        return property;
    }
}