import { PropertyMetadata } from "./PropertyMetadata";
import { DependencyObject } from "./DependencyObject";
import { TreeItem } from "../../Standard/Collections/index";

type ContextTarget = (typeof DependencyObject) | DependencyObject;

class PropertyContext extends TreeItem<PropertyContext> {
    constructor(target: ContextTarget | null, ...children: PropertyContext[]) {
        super(...children);
        this.target = target;
    }

    target: ContextTarget | null;
}

const mainContext = new PropertyContext(null);

const $unsetValue = Symbol("unset");

//Keys for DependencyProperty
const $id = Symbol();

/**
 * Eases the integration between user-defined properties and framework features.
 */
export class DependencyProperty {
    static get unsetValue(): symbol { return $unsetValue; }

    static register(target: typeof DependencyObject, name: string, metadata: PropertyMetadata) {
        const property = new DependencyProperty(0);
        return property;
    }

    constructor(id: number) {
        this[$id] = id;
    }

    get id(): number { return this[$id]; }
    private [$id]: number;
}