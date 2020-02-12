import { PropertyMetadata } from "./PropertyMetadata";
import { DependencyObject } from "./DependencyObject";
import { Collection } from "../../Standard/Collections/index";

type Target = (typeof DependencyObject) | DependencyObject;

class PropertyContext {
    constructor(target: Target | null) {
        this.target = target;
        this.parentContext = null;
        this.childContexts = new Collection();
    }

    addChildContext(context: PropertyContext) {
        context.parentContext = this;
        this.childContexts.add(context);
    }

    removeChildContext(context: PropertyContext) {
        context.parentContext = null;
        this.childContexts.remove(context);
    }

    target: Target | null;
    parentContext: PropertyContext | null;
    childContexts: Collection<PropertyContext>;
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