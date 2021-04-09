import { DependencyObject, DependencyProperty, PropertyMetadata } from "../../standard/dependency-objects/index.js";
import { Type } from "../../standard/reflection/index.js";

export class ControlAttribute extends DependencyObject {
    static nameProperty = DependencyProperty.registerAttached(ControlAttribute, "name", new PropertyMetadata(Type.get(String), ""));
    get name(): string { return this.get(ControlAttribute.nameProperty); }
    set name(name: string) { this.set(ControlAttribute.nameProperty, name); }

    static valueProperty = DependencyProperty.registerAttached(ControlAttribute, "value", new PropertyMetadata(Type.get(String), ""));
    get value(): string { return this.get(ControlAttribute.valueProperty); }
    set value(value: string) { this.set(ControlAttribute.valueProperty, value); }
}