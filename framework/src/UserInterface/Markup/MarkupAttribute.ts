import { MarkupNode } from "./MarkupNode.js";
import { assertParams } from "../../Validation/index.js";
import { DependencyProperty, PropertyChangeEventArgs, DependencyObject } from "../DependencyObjects/index.js";
import { Type } from "../../Standard/Types/Type.js";
import { Blender } from "../../Standard/Blender/index.js";

//Public keys for MarkupAttribute
const $updateValue = Symbol("updateValue");

export class MarkupAttribute extends MarkupNode {
    constructor(name: string, initialValue?: string) {
        super(name);

        assertParams({ name }, [String]);
        assertParams({ initialValue }, [String, undefined]);

        this.value = String(initialValue) || "";
    }

    protected __onPropertyChange(_sender: any, args: PropertyChangeEventArgs) {
        if (args.property === MarkupAttribute.valueProperty)
            this[$updateValue]();
    }

    static valueProperty = DependencyProperty.register(MarkupAttribute, "value", { valueType: Type.get(String), defaultValue: "" });
    get value(): string { return Blender.execute(this, DependencyObject, o => o.get(MarkupAttribute.valueProperty)); }
    set value(value: string) { Blender.execute(this, DependencyObject, o => o.set(MarkupAttribute.valueProperty, value)); }

    protected destructor(){
        //Remove self from parent
        if (this.parent)
            this.parent.attributes.remove(this);

        super.destructor();
    }
}