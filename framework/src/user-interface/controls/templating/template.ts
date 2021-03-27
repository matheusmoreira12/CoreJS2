import { DependencyObject, DependencyProperty } from "../../../standard/dependency-objects/index.js";
import { InvalidOperationException } from "../../../standard/exceptions/index.js"
import { Type } from "../../../standard/reflection/index.js";
// import { Control } from "../control.js";
import { ControlTemplate } from "./control-template.js";

export abstract class Template extends DependencyObject {
    constructor() {
        super();

        if (new.target === Template)
            throw new InvalidOperationException("Invalid contructor.");
    }

    // static childProperty = DependencyProperty.register(Template, "child", { valueType: Type.get(Control) });
    // get child(): ControlTemplate { return this.get(Template.childProperty); }
    // set child(value: ControlTemplate) { this.set(Template.childProperty, value); }
}