import { InvalidOperationException } from "../../Standard/index";

/**
 * Trigger base class
 */
export abstract class Trigger {
    constructor() {
        if (new.target === Trigger)
            throw new InvalidOperationException("Invalid constructor");
    }
}