import { DependencyProperty } from "../DependencyObjects/index.js"
import { assertParams } from "../../Validation/index.js";
import { PropertyTrigger } from "../Triggers/index.js";
import { Destructible } from "../../Standard/index.js";
import { Collection } from "../../Standard/Collections/index.js";
import { DependencyObject } from "../DependencyObjects/DependencyObject.js";

const allSetters: Collection<Setter> = new Collection();

/**
 * Sets the value of the specified property on the specified target to the specified value whenever the trigger's condition is met.
 */
export class Setter extends Destructible {
    static getAll(): Setter[] { return [...allSetters]; }

    constructor(target: DependencyObject, property: DependencyProperty, value: any) {
        super();

        assertParams({ target }, [DependencyObject]);
        assertParams({ property }, [DependencyProperty]);

        this.__target = target;
        this.__property = property;
        this.__value = value;
        this.__trigger = null;

        allSetters.add(this);
    }

    get target(): object { return this.__target; }
    private __target: object;

    get property(): DependencyProperty { return this.__property; }
    private __property: DependencyProperty;

    get value(): any { return this.__value; }
    private __value: any;

    __setTrigger(trigger: PropertyTrigger | null) {
        this.__trigger = trigger;
    }

    get trigger(): PropertyTrigger | null { return this.__trigger; }
    private __trigger: PropertyTrigger | null;

    protected destructor(): void {
        if (this.trigger)
            this.trigger.setters.remove(this);

        allSetters.remove(this);
    }
}