import { DependencyProperty } from "../../../standard/dependency-objects/index.js";
import { Type } from "../../../standard/reflection/type.js";
import { Template } from "./template.js";

export abstract class DataTemplate extends Template {
    static dataClassProperty = DependencyProperty.registerAttached(DataTemplate, "dataClass", { valueType: Type.get(Function) });
    get dataClass(): Function { return this.get(DataTemplate.dataClassProperty); }
    set dataClass(value: Function){ this.set(DataTemplate.dataClassProperty, value); }
}