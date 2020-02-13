import { InvalidOperationException, Destructible } from "../../Standard/index";
import { Collection } from "../../Standard/Collections/index";

const allTriggers: Collection<Trigger> = new Collection();

/**
 * Trigger base class
 */
export abstract class Trigger extends Destructible {
    static getAll() { return [...allTriggers]; }

    constructor() {
        if (new.target === Trigger)
            throw new InvalidOperationException("Invalid constructor");

        super();

        allTriggers.add(this);
    }

    protected destructor() {
        allTriggers.remove(this);
    }
}