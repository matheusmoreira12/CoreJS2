import { DependencyObject, DependencyProperty } from "../../DependencyObjects/index.js";
import { InvalidOperationException } from "../../../Standard/index.js";
import { Type } from "../../../Standard/Types/index.js";
import { Control } from "../Control.js";
import { ControlTemplate } from "./ControlTemplate.js";

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