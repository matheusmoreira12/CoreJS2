import { InvalidOperationException, Destructible } from "../../Standard/index.js";
import { Collection } from "../../Standard/Collections/index.js";

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