import { InvalidOperationException } from "../../standard/exceptions/index.js"
import { Dictionary } from "../../standard/collections/index.js";
import { DependencyObject } from "../../standard/dependency-objects/index.js";

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