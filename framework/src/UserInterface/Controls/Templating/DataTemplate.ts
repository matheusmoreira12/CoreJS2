import { DependencyProperty } from "../../DependencyObjects/index.js";
import { Type } from "../../../Standard/Types/Type.js";
import { Template } from "./Template.js";
import { InvalidOperationException } from "../../../Standard/index.js";

export class DataTemplate extends Template {
    static dataClassProperty = DependencyProperty.register(DataTemplate, "dataClass", { valueType: Type.get(Function) });
    get dataClass(): Function { return this.get(DataTemplate.dataClassProperty); }
    set dataClass(value: Function){ this.set(DataTemplate.dataClassProperty, value); }
}