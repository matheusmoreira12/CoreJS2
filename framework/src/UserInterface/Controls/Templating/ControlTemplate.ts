import { DependencyProperty, DependencyObject } from "../../DependencyObjects/index";
import { Type } from "../../../Standard/Types/index";
import { Control } from "../index";

export abstract class ControlTemplate extends DependencyObject {
    static controlClassProperty = DependencyProperty.register(ControlTemplate, "controlClass", { valueType: Type.get(Control) });
    public get controlClass(): Function { return this.get(ControlTemplate.controlClassProperty); }
    public set controlClass(value: Function) { this.set(ControlTemplate.controlClassProperty, value); }
}