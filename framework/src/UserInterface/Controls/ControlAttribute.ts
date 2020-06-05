import { DependencyObject, DependencyProperty } from "../../Standard/DependencyObjects/index.js";
import { Type } from "../../Standard/Reflection/index.js";

export class ControlAttribute extends DependencyObject {
    static nameProperty = DependencyProperty.registerAttached(ControlAttribute, "name", { valueType: Type.get(String), defaultValue: "" });
    get name(): string { return this.get(ControlAttribute.nameProperty); }
    set name(name: string) { this.set(ControlAttribute.nameProperty, name); }

    static valueProperty = DependencyProperty.registerAttached(ControlAttribute, "value", { valueType: Type.get(String), defaultValue: "" });
    get value(): string { return this.get(ControlAttribute.valueProperty); }
    set value(value: string) { this.set(ControlAttribute.valueProperty, value); }
}