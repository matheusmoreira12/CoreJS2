import { DependencyProperty } from "../../DependencyObjects/index";
import { Type } from "../../../Standard/Types/Type";
import { Template } from "./Template";
import { InvalidOperationException } from "../../../Standard/index";

export class DataTemplate extends Template {
    static dataClassProperty = DependencyProperty.register(DataTemplate, "dataClass", { valueType: Type.get(Function) });
    get dataClass(): Function { return this.get(DataTemplate.dataClassProperty); }
    set dataClass(value: Function){ this.set(DataTemplate.dataClassProperty, value); }
}