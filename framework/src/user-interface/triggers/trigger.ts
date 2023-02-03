import { Destructible } from "../../standard/index.js";
import { InvalidOperationException } from "../../standard/exceptions/index.js"
import { DependencyObject } from "../../standard/dependency-objects/index.js";

/**
 * Trigger base class
 */
export abstract class Trigger extends DependencyObject {
    constructor() {
        if (new.target === Trigger)
            throw new InvalidOperationException("Invalid constructor");

        super();
    }

    protected abstract _destructor(): void;
}