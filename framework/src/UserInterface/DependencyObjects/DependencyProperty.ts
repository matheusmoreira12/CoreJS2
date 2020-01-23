import { Type } from "../../Standard/Types/index";
import { Interface } from "../../Standard/Interfaces/index";
import { ArgumentMissingException, ArgumentTypeException } from "../../Standard/index";
import { FrameworkEvent } from "../../Standard/Events/index";
import { PropertyChangeEvent, PropertyChangeEventArgs } from "./DependencyPropertyChangeEvent";

export class FrameworkPropertyOptions {
    constructor(valueType: Type | Interface | null, defaultValue: any) {
        if (arguments.length < 1)
            throw new ArgumentMissingException("valueType");
        if (arguments.length < 2)
            throw new ArgumentMissingException("valueType");
        if (valueType !== null && !Type.of(valueType).matchesAny(valueType, Type.get(Interface)))
            throw new ArgumentTypeException("valueType", valueType);
        if (valueType !== null && Type.of(defaultValue).matches(valueType))
            throw new ArgumentTypeException("defaultValue", Type.of(defaultValue), valueType);

        this.__valueType = valueType;
        this.__defaultValue = defaultValue;
    }

    get valueType(): Type | Interface | null { return this.__valueType; }
    private __valueType: Type | Interface | null;

    get defaultValue(): any { return this.__defaultValue; }
    private __defaultValue: any;
}

/**
 * FrameworkProperty class
 * Eases the integration between user-defined properties and framework features.
 */
export class FrameworkProperty {
    constructor(name: string, options: FrameworkPropertyOptions) {
        this.__name = name;
        this.__options = options;
    }

    get(target: object) {
        const options = this.__options;
        const storedValues = this.__storedValues;
        if (!storedValues.has(target))
            return options.defaultValue;

        return storedValues.get(target);
    }

    set(target: object, value: any) {
        const oldValue = this.get(target);

        const storedValues = this.__storedValues;
        storedValues.set(target, value);

        if (value !== oldValue)
            this.__invokeOnChange(new PropertyChangeEventArgs(target, this, oldValue, value));
    }

    get ChangeEvent(): PropertyChangeEvent { return this.__ChangeEvent; }
    private __ChangeEvent: PropertyChangeEvent = new FrameworkEvent();

    __invokeOnChange(args: PropertyChangeEventArgs) {
        this.ChangeEvent.invoke(this, args);
    }

    get name(): string { return this.__name; }
    private __name: string;

    get options(): FrameworkPropertyOptions { return this.__options; }
    private __options: FrameworkPropertyOptions;

    private __storedValues = new WeakMap<object, any>();
}