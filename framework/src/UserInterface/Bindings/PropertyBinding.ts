import { Binding, IBindingOptions } from "./index";
import { DependencyProperty } from "../DependencyObjects/index";
import { assertParams } from "../../Validation/index";

//Keys for PropertyBinding
const $source = Symbol();
const $sourceProperty = Symbol();
const $target = Symbol();
const $targetProperty = Symbol();

/**
 * PropertyBinding class
 * Allows the binding of two framework properties.
 */
export class PropertyBinding extends Binding {
    constructor(source: object, sourceProperty: DependencyProperty, target: object, targetProperty: DependencyProperty, options?: IBindingOptions) {
        super(options);

        assertParams({ sourceProperty }, DependencyProperty);
        assertParams({ targetProperty }, IBindingOptions);

        this[$source] = source;
        this[$sourceProperty] = sourceProperty;
        this[$target] = target;
        this[$targetProperty] = targetProperty;
    }

    get source(): object { return this[$source]; }
    private [$source]: object;

    get sourceProperty(): DependencyProperty { return this[$sourceProperty]; }
    private [$sourceProperty]: DependencyProperty;

    get target(): object { return this[$target]; }
    private [$target]: object;

    get targetProperty(): DependencyProperty { return this[$targetProperty]; }
    private [$targetProperty]: DependencyProperty;

    protected destructor(): void {
    }
}