import { InvalidOperationException } from "../exceptions/index.js";
import { Type } from "../reflection/index.js";
import { DependencyObject } from "./index.js";

export namespace __Validation {
    export function assertAttachedProperty(targetType: Type, name: string, isReadonly: boolean) {
        const prototypeField = targetType.getField("prototype") as DependencyObject;
        const descriptor = Object.getOwnPropertyDescriptor(prototypeField, name);
        if (!descriptor)
            throw new InvalidOperationException(`Cannot register dependency property. Missing property ${name} in ${targetType.name}.`)
        else if (!descriptor.get)
            throw new InvalidOperationException(`Cannot register dependency property. Missing getter for property ${name} in class ${targetType.name}.`);
        else if (!descriptor.set && !isReadonly)
            throw new InvalidOperationException(`Cannot register dependency property. Missing setter for property ${name} in class ${targetType.name}.`);
    }
}