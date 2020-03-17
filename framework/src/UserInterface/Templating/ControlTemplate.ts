import { DependencyProperty, DependencyObject } from "../DependencyObjects/index";
import { Type } from "../../Standard/Types/index";
import { Control } from "../Controls/index";

export abstract class ControlTemplate extends DependencyObject {
    abstract apply(target: Control): void;

    static targetControlProperty = DependencyProperty.register(<any>ControlTemplate, "targetControl", { valueType: Type.get(<any>Control) });
    public get targetControl(): Function { return this.get(ControlTemplate.targetControlProperty); }
    public set targetControl(value: Function) { this.set(ControlTemplate.targetControlProperty, value); }
}