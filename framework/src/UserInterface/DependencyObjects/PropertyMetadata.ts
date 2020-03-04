import { Type } from "../../Standard/Types/index";
import { Interface } from "../../Standard/Interfaces/index";
import { assertParams } from "../../Validation/index";
import { DependencyProperty } from "./DependencyProperty";

const $name = Symbol();
const $valueType = Symbol();
const $defaultValue = Symbol();

function assertDefaultValue(valueType: Type | Interface | null, defaultValue: any) {
    if (defaultValue !== null)
        assertParams({ defaultValue }, valueType);
}

export class PropertyMetadata {
    constructor(name: string, valueType: Type | Interface | null = null, defaultValue: any = null) {
        assertParams({ name }, String);
        assertParams({ valueType }, Type, Interface, null);
        assertDefaultValue(valueType, defaultValue);

        this[$name] = name;
        this[$valueType] = valueType;
        this[$defaultValue] = defaultValue;
    }

    get name(): string { return this[$name]; }
    private [$name]: string;

    get valueType(): Type | Interface | null { return this[$valueType]; }
    private [$valueType]: Type | Interface | null;

    get defaultValue(): any { return this[$defaultValue]; }
    private [$defaultValue]: any;
}
