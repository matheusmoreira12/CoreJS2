import { InvalidOperationException } from "../exceptions/index.js";
import { DependencyObjectClass } from "./dependency-object-class.js";

export namespace __Validation {
    export function assertAttachedProperty(target: DependencyObjectClass, name: string, isReadonly: boolean) {
        const descriptor = Object.getOwnPropertyDescriptor(target.prototype, name);
        if (!descriptor)
            throw new InvalidOperationException(`Cannot register dependency property. Missing property ${name} in ${target.name}.`)
        else if (!descriptor.get)
            throw new InvalidOperationException(`Cannot register dependency property. Missing getter for property ${name} in class ${target.name}.`);
        else if (!descriptor.set && !isReadonly)
            throw new InvalidOperationException(`Cannot register dependency property. Missing setter for property ${name} in class ${target.name}.`);
    }
}