import { IBindingOptions } from "./index.js";
import { Destructible } from "../../Standard/index.js";
/**
 * Binding base class
 */
export declare abstract class Binding extends Destructible {
    constructor(options?: IBindingOptions);
    get options(): IBindingOptions;
    protected __options: IBindingOptions;
}
