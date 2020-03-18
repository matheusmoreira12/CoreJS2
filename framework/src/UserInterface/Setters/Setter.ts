import { DependencyProperty } from "../DependencyObjects/index"
import { assertParams } from "../../Validation/index";
import { PropertyTrigger } from "../Triggers/index";
import { Destructible } from "../../Standard/index";
import { Collection } from "../../Standard/Collections/index";
import { DependencyObject } from "../DependencyObjects/DependencyObject";

const allSetters: Collection<Setter> = new Collection();

//Public keys for Setter
export const $setTrigger = Symbol("setTrigger");
export const $unsetTrigger = Symbol("unsetTrigger");

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

    [$setTrigger](trigger: PropertyTrigger) {
        this[$trigger] = trigger;
    }

    [$unsetTrigger]() {
        this[$trigger] = null;
    }

    get trigger(): PropertyTrigger | null { return this[$trigger]; }
    private [$trigger]: PropertyTrigger | null;

    protected destructor(): void {
        if (this.trigger)
            this.trigger.setters.remove(this);

        allSetters.remove(this);
    }
}