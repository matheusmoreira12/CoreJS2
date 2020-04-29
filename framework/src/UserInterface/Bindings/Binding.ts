import { Destructible } from "../../Standard/index.js";
import { IBindingOptions, BindingDirection } from "./index.js";
import { InvalidOperationException } from "../../Standard/Exceptions/index.js"
import { assertParams } from "../../Validation/index.js";

const DEFAULT_BINDING_OPTIONS: IBindingOptions = {
    direction: BindingDirection.Both
};

//Keys for Binding
const $options = Symbol("options");

/**
 * Binding base class
 */
export abstract class Binding extends Destructible {
    constructor(options?: IBindingOptions) {
        if (new.target === Binding)
            throw new InvalidOperationException("Invalid constructor.");

        super();

        assertParams({ options }, [IBindingOptions]);

        this[$options] = Object.assign({}, DEFAULT_BINDING_OPTIONS, options);
    }

    get options(): IBindingOptions { return this[$options]; }
    protected [$options]: IBindingOptions;
}