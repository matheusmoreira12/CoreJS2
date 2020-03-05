import { IPropertyOptions } from "./IPropertyOptions";
import { assertParams } from "../../Validation/index";

import * as Registry from "./Registry";

//Keys for DependencyProperty
const $name = Symbol();

/**
 * Eases the integration between user-defined properties and framework features.
 */
export class DependencyProperty {
    static register(target: typeof Object, name: string, options: IPropertyOptions = {}): DependencyProperty {
        assertParams({ target }, Function);
        assertParams({ options }, IPropertyOptions);

        const property = new DependencyProperty(name);
        Registry.register(target, property, options);
        return property;
    }

    constructor(name: string) {
        assertParams({ name }, String);

        this[$name] = name;
    }

    get name(): string { return this[$name]; }
    private [$name]: string;
}