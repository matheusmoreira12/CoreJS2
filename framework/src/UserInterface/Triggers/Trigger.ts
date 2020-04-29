import { Destructible } from "../../Standard/index.js";
import { InvalidOperationException } from "../../Standard/Exceptions/index.js"

/**
 * Trigger base class
 */
export abstract class Trigger extends Destructible {
    constructor() {
        if (new.target === Trigger)
            throw new InvalidOperationException("Invalid constructor");

        super();
    }
}