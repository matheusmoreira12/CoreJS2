import { Enumeration } from "../../Standard/index.js";
import { Interface } from "../../Standard/Interfaces/index.js";
import { IValueConverter } from "../ValueConverters/index.js";
export declare const BindingDirection: Enumeration;
export declare const IBindingOptions: Interface;
export interface IBindingOptions {
    direction?: number;
    valueConverter?: IValueConverter;
}
