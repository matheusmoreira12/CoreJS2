import { Attribute } from "./index.js";
import { ArgumentTypeException, InvalidOperationException } from "../../../Exceptions/index.js";

import * as _Registry from "./_Registry.js";

const INVALID_ARG_CONTEXT_ERR_MSG = "Cannot declare attributes. Attributes can only be declared on a class or class field context.";

export function attrs(attributes: Attribute[]): ClassDecorator;
export function attrs(attributes: Attribute[]): PropertyDecorator;
export function attrs(attributes: Attribute[]): MethodDecorator;
export function attrs(attributes: Attribute[]): ParameterDecorator;
export function attrs(attributes: Attribute[]): ClassDecorator | PropertyDecorator | MethodDecorator | ParameterDecorator {
    return (arg0: Function | object, arg1?: string | symbol, arg2?: TypedPropertyDescriptor<any> | number) => {
        if (typeof arg0 == "function") {
            if (arg1 === undefined)
                _Registry.registerAttributes(arg0, null, attributes);
            else if (typeof arg1 == "string" || typeof arg1 == "symbol") {
                if (arg2 === undefined || typeof arg2 == "object") {
                    _Registry.registerAttributes(arg0, arg1, attributes);
                    return arg2;
                }
                else if (typeof arg2 == "number")
                    throw new InvalidOperationException(INVALID_ARG_CONTEXT_ERR_MSG);
                else
                    throw new ArgumentTypeException("arg2");
            }
            else
                throw new ArgumentTypeException("arg1");
        }
        else if (typeof arg0 == "object")
            throw new InvalidOperationException(INVALID_ARG_CONTEXT_ERR_MSG);
        else
            throw new ArgumentTypeException("arg0");
    }
}