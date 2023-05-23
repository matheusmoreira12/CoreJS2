import { BindingDirection } from "./index.js";
import { InvalidOperationException } from "../../standard/exceptions/index.js"
import { assertParams } from "../../validation/index.js";
import { IValueConverter } from "../value-converters/index.js";
import { Destructible } from "../../standard/index.js";

/**
 * Binding base class
 */
export abstract class Binding extends Destructible {
    constructor() {
        if (new.target === Binding)
            throw new InvalidOperationException("Invalid constructor.");

        super();
    }

    get id() {
        return this.__id ?? (() => { throw new InvalidOperationException("Cannot get id. Invalid DependencyPropertyKey.") })();
    }
    __id: bigint | null = null;
}