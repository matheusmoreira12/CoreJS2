import { MarkupNodeName } from "./MarkupNodeName.js";
import { assertParams } from "../../Validation/index.js";
import { DependencyProperty, DependencyObject } from "../DependencyObjects/index.js";
import { Type } from "../../Standard/Types/Type.js";
import { Blender } from "../../Standard/Blender/index.js";

export class MarkupAttribute extends MarkupNodeName {
    constructor(name: string, initialValue?: string) {
        super(name);

        assertParams({ name }, [String]);
        assertParams({ initialValue }, [String, undefined]);

        this.value = initialValue!;
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