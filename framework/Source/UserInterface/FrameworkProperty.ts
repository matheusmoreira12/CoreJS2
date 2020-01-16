import { Type } from "../Standard/Types/Types";
import { Interface } from "../Standard/Interfaces/Interface";
import { ArgumentMissingException, ArgumentTypeException } from "../Standard/index";

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

    private __valueType: Type | Interface | null;
    private __defaultValue: any;
}

/**
 * FrameworkProperty class
 * Eases the integration between user-defined properties and framework features.
 */
export class FrameworkProperty {
    constructor(name: string, options: FrameworkPropertyOptions) {
        options = Object.assign({}, DEFAULT_FRAMEWORK_PROPERTY_OPTIONS, options);

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
            this.ChangeEvent.invoke(this, {
                target: target,
                property: this,
                oldValue: oldValue,
                newValue: value
            });
    }

    ChangeEvent = new FrameworkEvent();

    get name(): string { return this.__name; }
    private __name: string;

    get options(): FrameworkPropertyOptions { return this.__options; }
    private __options: FrameworkPropertyOptions;

    private __storedValues = new WeakMap<object, any>();
}