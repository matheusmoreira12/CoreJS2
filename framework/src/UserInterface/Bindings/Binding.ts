import { IBindingOptions, BindingDirection } from "./index.js";
import { InvalidOperationException } from "../../Standard/Exceptions/index.js"
import { assertParams } from "../../Validation/index.js";
import { DependencyObject, DependencyProperty } from "../../Standard/DependencyObjects/index.js";

const DEFAULT_BINDING_OPTIONS: IBindingOptions = {
    direction: BindingDirection.Both
};

/**
 * Binding base class
 */
export abstract class Binding extends DependencyObject {
    constructor(options?: IBindingOptions) {
        if (new.target === Binding)
            throw new InvalidOperationException("Invalid constructor.");

        super();

        assertParams({ options }, [IBindingOptions]);

        options = Object.assign({}, DEFAULT_BINDING_OPTIONS, options);
        this.set(Binding.optionsProperty, options);
    }

    static optionsProperty = DependencyProperty.registerReadonly(Binding, "options", { valueType: IBindingOptions });
    get options(): IBindingOptions { return this.get(Binding.optionsProperty); }
}