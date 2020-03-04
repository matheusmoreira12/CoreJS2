import { IBindingOptions, BindingDirection } from "./index";
import { Destructible, InvalidOperationException } from "../../Standard/index";
import { assertParams } from "../../Validation/index";

const DEFAULT_BINDING_OPTIONS = {
    direction: BindingDirection.Both,
    valueConverter: null
};

//Keys for Binding
const $options = Symbol();

/**
 * Binding base class
 */
export abstract class Binding extends Destructible {
    constructor(options?: IBindingOptions) {
        if (new.target === Binding)
            throw new InvalidOperationException("Invalid constructor.");

        super();

        assertParams({ options }, IBindingOptions);

        this[$options] = Object.assign({}, DEFAULT_BINDING_OPTIONS, options);
    }

    get options(): IBindingOptions { return this[$options]; }
    protected [$options]: IBindingOptions;
}