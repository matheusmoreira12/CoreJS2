import { IBindingOptions, BindingDirection } from "./index";
import { Destructible, InvalidOperationException, ArgumentTypeException } from "../../Standard/index";
import { assertParams } from "../../Validation/index";
import { Collection } from "../../Standard/Collections/index";

const allBindings: Collection<Binding> = new Collection();

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
    static getAll(): Binding[] { return [...allBindings]; }

    constructor(options?: IBindingOptions) {
        if (new.target === Binding)
            throw new InvalidOperationException("Invalid constructor.");

        super();

        assertParams({ options }, IBindingOptions);

        this[$options] = Object.assign({}, DEFAULT_BINDING_OPTIONS, options);
        
        allBindings.add(this);
    }

    get options(): IBindingOptions { return this[$options]; }
    protected [$options]: IBindingOptions;

    protected destructor() {
        allBindings.remove(this);
    }
}