import { IPropertyOptions } from "./IPropertyOptions.js";
import { assertParams } from "../../Validation/index.js";

import * as Registry from "./Registry.js";
import { Class } from "../../Standard/Types/Types.js";
import { InvalidOperationException } from "../../Standard/Exceptions/index.js";

const DEFAULT_PROPERTY_OPTIONS: IPropertyOptions = {
    defaultValue: null
};

//Keys for DependencyProperty

/**
 * Eases the integration between user-defined properties and framework features.
 */
export class DependencyProperty {
    static register(target: Class<any>, name: string, options: IPropertyOptions = {}): DependencyProperty {
        assertParams({ target }, [Function]);
        assertParams({ options }, [IPropertyOptions]);

        options = Object.assign({}, DEFAULT_PROPERTY_OPTIONS, options);

        const property = new DependencyProperty(name);
        Registry.register(target, property, options);
        return property;
    }

    static getOptions(property: DependencyProperty): IPropertyOptions {
        const options = Registry.getOptions(property);
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