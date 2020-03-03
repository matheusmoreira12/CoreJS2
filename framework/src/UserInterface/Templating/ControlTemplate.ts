import { DependencyProperty, PropertyMetadata, IDependencyObject } from "../DependencyObjects/index";
import { Type } from "../../Standard/Types/index";
import { Control } from "../Controls/index";

export abstract class ControlTemplate extends DependencyObject {
    abstract apply(target: Control): void;

    static targetControlProperty = DependencyProperty.register(<any>ControlTemplate, new PropertyMetadata("targetControl", Type.get(<any>Control), DependencyProperty.unsetValue));
    public get targetControl(): Function { return this.get(ControlTemplate.targetControlProperty); }
    public set targetControl(value: Function) { this.set(ControlTemplate.targetControlProperty, value); }
}