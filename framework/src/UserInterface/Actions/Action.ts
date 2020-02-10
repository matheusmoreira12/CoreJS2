import { InvalidOperationException } from "../../Standard/index";
import { FrameworkEvent } from "../../Standard/Events/index";
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
}