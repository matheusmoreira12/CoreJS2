import { DependencyObject, DependencyProperty } from "../../DependencyObjects/index";
import { InvalidOperationException } from "../../../Standard/index";
import { Type } from "../../../Standard/Types/index";
import { Control } from "../Control";
import { ControlTemplate } from "./ControlTemplate";

export abstract class Template extends DependencyObject {
    constructor() {
        super();

        if (new.target === Template)
            throw new InvalidOperationException("Invalid contructor.");
    }

    static childProperty = DependencyProperty.register(Template, "child", { valueType: Type.get(Control) });
    get child(): ControlTemplate { return this.get(Template.childProperty); }
    set child(value: ControlTemplate) { this.set(Template.childProperty, value); }
}