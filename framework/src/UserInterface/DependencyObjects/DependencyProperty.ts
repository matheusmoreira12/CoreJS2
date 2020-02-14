import { PropertyMetadata } from "./PropertyMetadata";
import { DependencyObject } from "./DependencyObject";
import { DataContext } from "../DataContexts/index";
import { assertParams } from "../../Validation/index";
import { Interface } from "../../Standard/Interfaces/index";

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

    static overrideContext(target: DependencyObject) {
        DataContext.override(target);
    }

    constructor(id: number) {
        assertParams({ id }, Number);

        this[$id] = id;
    }

    get id(): number { return this[$id]; }
    private [$id]: number;
}

function registerProperty(target: typeof DependencyObject, name: string, metadata: PropertyMetadata): DependencyProperty {
    
}