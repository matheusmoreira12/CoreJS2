import { IPropertyMetadata } from "./IPropertyMetadata.js";
import { assertParams } from "../../Validation/index.js";

import * as Registry from "./Registry.js";
import { Class } from "../../Standard/Types/Types.js";
import { InvalidOperationException } from "../../Standard/Exceptions/index.js";

const DEFAULT_PROPERTY_METADATA: IPropertyMetadata = {
    defaultValue: null
};

function assertAttachedProperty(target: Class<any>, name: string, isReadonly: boolean) {
    const descriptor = Object.getOwnPropertyDescriptor(target.prototype, name);
    if (!descriptor)
        throw new InvalidOperationException(`Cannot register dependency property. Missing property ${name} in ${target.name}.`)
    else if (!descriptor.get)
        throw new InvalidOperationException(`Cannot register dependency property. Missing getter for property ${name} in class ${target.name}.`);
    else if (!descriptor.set && !isReadonly)
        throw new InvalidOperationException(`Cannot register dependency property. Missing setter for property ${name} in class ${target.name}.`);
}

/**
 * Eases the integration between user-defined properties and framework features.
 */
export class DependencyProperty {
    static registerAttached(target: Class<any>, name: string, metadata: IPropertyMetadata = {}): DependencyProperty {
        assertParams({ target }, [Function]);
        assertParams({ options: metadata }, [IPropertyMetadata]);

        metadata = Object.assign({}, DEFAULT_PROPERTY_METADATA, metadata);

        assertAttachedProperty(target, name, false);

        const property = new DependencyProperty(name);
        Registry.registerAttached(target, property, metadata);
        return property;
    }

    static getMetadata(property: DependencyProperty): IPropertyMetadata {
        const options = Registry.getMetadata(property);
        if (options)
            return options;
        else
            throw new InvalidOperationException("Cannot get options. The specified property has not been registered.")
    }

    static getAll(target: Class<any>): DependencyProperty[] {
        return Registry.getAll(target);
    }

    constructor(name: string) {
        assertParams({ name }, [String]);

        this.__name = name;
    }

    get name(): string { return this.__name; }
    private __name: string;
}