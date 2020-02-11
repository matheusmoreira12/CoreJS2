import { InvalidOperationException } from "../../Standard/index";
import { Dictionary } from "../../Standard/Collections/index";

/**
 * FrameworkAction base class
 * Represents an user-initiated action.
 */
export abstract class Action {
    constructor() {
        if (this.constructor === Action)
            throw new InvalidOperationException("Invalid constructor");
    }

    abstract execute(data: Dictionary<string, any>): void;
}