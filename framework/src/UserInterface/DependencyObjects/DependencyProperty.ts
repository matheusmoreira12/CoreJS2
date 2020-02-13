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
        assertParams({ target }, Interface.extract(target));
        assertParams({ name }, String);
        assertParams({ metadata }, PropertyMetadata);

        return new DependencyProperty(0);
    }

    static overrideContext(target: DependencyObject) {
        assertParams({ target }, Interface.extract(target));

        DataContext.override(target);
    }

    constructor(id: number) {
        assertParams({ id }, Number);

        this[$id] = id;
    }

    get id(): number { return this[$id]; }
    private [$id]: number;
}