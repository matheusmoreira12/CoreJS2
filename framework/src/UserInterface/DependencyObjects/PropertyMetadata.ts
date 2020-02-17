import { Type } from "../../Standard/Types/index";
import { Interface } from "../../Standard/Interfaces/index";
import { assertParams } from "../../Validation/index";
import { DependencyProperty, $setProperty } from "./DependencyProperty";

const $valueType = Symbol();
const $defaultValue = Symbol();
const $property = Symbol();

function assertDefaultValue(valueType: Type | Interface | null, defaultValue: any) {
    if (defaultValue !== DependencyProperty.unsetValue)
        assertParams({ defaultValue }, valueType);
}

export class PropertyMetadata {
    constructor(valueType: Type | Interface | null, defaultValue: any = DependencyProperty.unsetValue) {
        assertParams({ valueType }, Type, Interface, null);
        assertDefaultValue(valueType, defaultValue);

        this[$valueType] = valueType;
        this[$defaultValue] = defaultValue;
    }

    get valueType(): Type | Interface | null { return this[$valueType]; }
    private [$valueType]: Type | Interface | null;

    get defaultValue(): any { return this[$defaultValue]; }
    private [$defaultValue]: any;

    [$setProperty](property: DependencyProperty) {
        this[$property] = property;
    }

    get property(): DependencyProperty | null { return this[$property]; }
    private [$property]: DependencyProperty;
}
