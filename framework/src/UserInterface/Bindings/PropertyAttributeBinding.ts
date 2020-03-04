import { Binding, IBindingOptions } from "./index";
import { DependencyProperty } from "../DependencyObjects/index";
import { assertParams } from "../../Validation/index";

//Keys for PropertyAttributeBinding
const $source = Symbol();
const $sourceProperty = Symbol();
const $targetElement = Symbol();
const $targetAttributeName = Symbol();

/**
 * PropertyAttributeBinding class
 * Allows the binding of an attribute to a framework property.
 */
export class PropertyAttributeBinding extends Binding {
    constructor(source: object, sourceProperty: DependencyProperty, targetElement: Element, targetAttributeName: string, options?: IBindingOptions) {
        super(options);

        assertParams({ sourceProperty }, DependencyProperty);
        assertParams({ targetElement }, Element);
        assertParams({ targetAttributeName }, String);

        this[$source] = source;
        this[$sourceProperty] = sourceProperty;
        this[$targetElement] = targetElement;
        this[$targetAttributeName] = targetAttributeName;
    }

    get source(): object { return this[$source]; }
    private [$source]: object;

    get sourceProperty(): DependencyProperty { return this[$sourceProperty]; }
    private [$sourceProperty]: DependencyProperty;

    get targetElement(): Element { return this[$targetElement]; }
    private [$targetElement]: Element;

    get targetAttributeName(): string { return this[$targetAttributeName]; }
    private [$targetAttributeName]: string;

    protected destructor(): void {
    }
}