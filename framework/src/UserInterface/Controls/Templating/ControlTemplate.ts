import { DependencyProperty } from "../../DependencyObjects/index";
import { Type } from "../../../Standard/Types/index";
import { Control } from "../index";
import { Template } from "./Template";

export class ControlTemplate extends Template {
    static controlClassProperty = DependencyProperty.register(ControlTemplate, "controlClass", { valueType: Type.get(Control) });
    public get controlClass(): Function { return this.get(ControlTemplate.controlClassProperty); }
    public set controlClass(value: Function) { this.set(ControlTemplate.controlClassProperty, value); }
}