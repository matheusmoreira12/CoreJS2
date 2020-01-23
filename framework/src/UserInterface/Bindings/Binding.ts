import { IBindingOptions, BindingDirection } from "./index";
import { Destructible, InvalidOperationException, ArgumentTypeException } from "../../Standard/index";
import { Type } from "../../Standard/Types/index";

const DEFAULT_BINDING_OPTIONS = {
    direction: BindingDirection.Both,
    valueConverter: null
};

/**
 * Binding base class
 */
export abstract class Binding extends Destructible {
    constructor(options?: IBindingOptions) {
        if (new.target === Binding)
            throw new InvalidOperationException("Invalid constructor.");

        super();

        if (options !== null && !Type.of(options).implements(IBindingOptions))
            throw new ArgumentTypeException("options", Type.of(options), IBindingOptions);

        this.__options = Object.assign({}, DEFAULT_BINDING_OPTIONS, options);
    }

    get options(): IBindingOptions { return this.__options; }
    protected __options: IBindingOptions;
}