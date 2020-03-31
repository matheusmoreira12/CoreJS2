import { DependencyObject, DependencyProperty } from "../../DependencyObjects/index";
import { Type } from "../../../Standard/Types/Type";

export class DataTemplate extends DependencyObject {
    static dataClassProperty = DependencyProperty.register(DataTemplate, "dataClass", { valueType: Type.get(Function) });
    get dataClass(): Function { return this.get(DataTemplate.dataClassProperty); }
    set dataClass(value: Function){ this.set(DataTemplate.dataClassProperty, value); }
}