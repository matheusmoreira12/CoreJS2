import { DependencyProperty } from "../../../standard/dependency-objects/index.js";
import { Type } from "../../../standard/reflection/index.js";
// import { Control } from "../index.js";
import { Template } from "./template.js";

export class ControlTemplate extends Template {
    // static controlClassProperty = DependencyProperty.register(ControlTemplate, "controlClass", { valueType: Type.get(Control) });
    // public get controlClass(): Function { return this.get(ControlTemplate.controlClassProperty); }
    // public set controlClass(value: Function) { this.set(ControlTemplate.controlClassProperty, value); }
}