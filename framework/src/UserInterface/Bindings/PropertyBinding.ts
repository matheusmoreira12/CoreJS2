import { Binding, IBindingOptions } from "./index";
import { DependencyProperty } from "../DependencyObjects/index";
import { assertParams } from "../../Validation/index";
import { DependencyObject } from "../DependencyObjects/DependencyObject";

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
    constructor(source: DependencyObject, sourceProperty: DependencyProperty, target: DependencyObject, targetProperty: DependencyProperty, options?: IBindingOptions) {
        super(options);

        assertParams({ source }, DependencyObject);
        assertParams({ sourceProperty }, DependencyProperty);
        assertParams({ target }, DependencyObject);
        assertParams({ targetProperty }, IBindingOptions);

        this[$source] = source;
        this[$sourceProperty] = sourceProperty;
        this[$target] = target;
        this[$targetProperty] = targetProperty;
    }

    get source(): DependencyObject { return this[$source]; }
    private [$source]: DependencyObject;

    get sourceProperty(): DependencyProperty { return this[$sourceProperty]; }
    private [$sourceProperty]: DependencyProperty;

    get target(): DependencyObject { return this[$target]; }
    private [$target]: DependencyObject;

    get targetProperty(): DependencyProperty { return this[$targetProperty]; }
    private [$targetProperty]: DependencyProperty;

    protected destructor(): void {
    }
}