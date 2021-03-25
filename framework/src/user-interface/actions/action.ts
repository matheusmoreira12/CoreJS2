import { InvalidOperationException } from "../../Standard/Exceptions/index.js"
import { Dictionary } from "../../Standard/Collections/index.js";
import { DependencyObject } from "../../Standard/DependencyObjects/index.js";

/**
 * FrameworkAction base class
 * Represents an user-initiated action.
 */
export abstract class Action extends DependencyObject {
    constructor() {
        super();

        if (this.constructor === Action)
            throw new InvalidOperationException("Invalid constructor");
    }

    abstract execute(data: Dictionary<string, any>): void;
}