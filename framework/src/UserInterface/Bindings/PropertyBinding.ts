import { Binding, IBindingOptions, BindingDirection } from "./index";
import { DependencyProperty, PropertyChangeEventArgs, IDependencyObject } from "../DependencyObjects/index";
import { ArgumentTypeException, Enumeration } from "../../Standard/index";
import { assertParams } from "../../Validation/index";
import { Interface } from "../../Standard/Interfaces/index";

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
    constructor(source: IDependencyObject, sourceProperty: DependencyProperty, target: IDependencyObject, targetProperty: DependencyProperty, options?: IBindingOptions) {
        super(options);

        assertParams({ sourceProperty }, DependencyProperty);
        assertParams({ targetProperty }, IBindingOptions);

        this[$source] = source;
        this[$sourceProperty] = sourceProperty;
        this[$target] = target;
        this[$targetProperty] = targetProperty;
    }

    get source(): IDependencyObject { return this[$source]; }
    private [$source]: IDependencyObject;

    get sourceProperty(): DependencyProperty { return this[$sourceProperty]; }
    private [$sourceProperty]: DependencyProperty;

    get target(): IDependencyObject { return this[$target]; }
    private [$target]: IDependencyObject;

    get targetProperty(): DependencyProperty { return this[$targetProperty]; }
    private [$targetProperty]: DependencyProperty;

    protected destructor(): void {
    }
}