import { DependencyProperty } from "../DependencyObjects/index.js"
import { assertParams } from "../../Validation/index.js";
import { PropertyTrigger } from "../Triggers/index.js";
import { Destructible } from "../../Standard/index.js";
import { Collection } from "../../Standard/Collections/index.js";
import { DependencyObject } from "../DependencyObjects/DependencyObject.js";

const allSetters: Collection<Setter> = new Collection();

//Public keys for Setter
export const $setTrigger = Symbol("setTrigger");

//Keys for Setter
const $property = Symbol("property");
const $value = Symbol("value");
const $target = Symbol("target");
const $trigger = Symbol("trigger");

/**
 * Sets the value of the specified property on the specified target to the specified value whenever the trigger's condition is met.
 */
export class Setter extends Destructible {
    static getAll(): Setter[] { return [...allSetters]; }

    constructor(target: DependencyObject, property: DependencyProperty, value: any) {
        super();

        assertParams({ target }, [DependencyObject]);
        assertParams({ property }, [DependencyProperty]);

        this[$target] = target;
        this[$property] = property;
        this[$value] = value;
        this[$trigger] = null;

        allSetters.add(this);
    }

    get target(): object { return this[$target]; }
    private [$target]: object;

    get property(): DependencyProperty { return this[$property]; }
    private [$property]: DependencyProperty;

    get value(): any { return this[$value]; }
    private [$value]: any;

    [$setTrigger](trigger: PropertyTrigger | null) {
        this[$trigger] = trigger;
    }

    get trigger(): PropertyTrigger | null { return this[$trigger]; }
    private [$trigger]: PropertyTrigger | null;

    protected destructor(): void {
        if (this.trigger)
            this.trigger.setters.remove(this);

        allSetters.remove(this);
    }
}