import { DependencyProperty, DependencyPropertyOptions } from "../../Standard/DependencyObjects/index";
import { Type } from "../../Standard/Types/index";
import { Control } from "../Controls/index";

export abstract class ControlTemplate {
    abstract apply(target: Control): void;

    static targetControlProperty = new DependencyProperty("targetControl", new DependencyPropertyOptions(Type.get(<any>Control), Control));
    public get targetControl(): Function { return ControlTemplate.targetControlProperty.get(this); }
    public set targetControl(value: Function) { ControlTemplate.targetControlProperty.set(this, value); }
}