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

function getContextByTarget(target: ContextTarget) {
    return mainContext.findRecursive(c => c.target === target);
}

function getNearestUpperInstanceContext(target: DependencyObject): PropertyContext | null {
    return mainContext.selectRecursive()
}

function getNearestUpperConstructorContext(target: DependencyObject): PropertyContext | null {

}

function getNearestUpperContext(target: DependencyObject): PropertyContext | null {
    return getNearestUpperInstanceContext(target) || getNearestUpperConstructorContext(target) || null;
}

function getOrCreateContext(target: ContextTarget) {
    let context: PropertyContext | null = getContextByTarget(target);
    if (context === null) {
        context = new PropertyContext(target);
        mainContext.children.add(context);
    }
    return context;
}

const $unsetValue = Symbol("unset");

//Keys for DependencyProperty
const $id = Symbol();

/**
 * Eases the integration between user-defined properties and framework features.
 */
export class DependencyProperty {
    static get unsetValue(): symbol { return $unsetValue; }

    static register(target: typeof DependencyObject, name: string, metadata: PropertyMetadata) {
        const context = getOrCreateContext(target);
        const property = new DependencyProperty(0);
        return property;
    }

    static overrideContext(target: DependencyObject) {

    }

    constructor(id: number) {
        this[$id] = id;
    }

    get id(): number { return this[$id]; }
    private [$id]: number;
}