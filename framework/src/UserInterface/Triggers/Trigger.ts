import { Destructible } from "../../Standard/index.js";
import { InvalidOperationException } from "../../Standard/Exceptions/index.js"
import { DependencyObject } from "../../Standard/DependencyObjects/index.js";

/**
 * Trigger base class
 */
export abstract class Trigger extends DependencyObject {
    constructor() {
        if (new.target === Trigger)
            throw new InvalidOperationException("Invalid constructor");

        super();
    }

    protected abstract destructor(): void;
}