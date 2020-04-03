import { VisualTreeNode } from "./VisualTreeNode.js";
import { assertParams } from "../../Validation/index.js";
import { DependencyProperty, PropertyChangeEventArgs, DependencyObject } from "../DependencyObjects/index.js";
import { Type } from "../../Standard/Types/Type.js";
import { Blender } from "../../Standard/Blender/index.js";
import { $updateAttribute } from "./index.js";

//Public keys for VisualTreeAttribute
const $updateValue = Symbol("updateValue");

export class VisualTreeAttribute extends VisualTreeNode {
    constructor(qualifiedName: string, namespaceURI: string | null = null, initialValue?: string) {
        super(qualifiedName, namespaceURI);

        assertParams({ qualifiedName }, [String]);
        assertParams({ namespaceURI }, [String, null]);
        assertParams({ initialValue }, [String, undefined]);

        this.value = String(initialValue) || "";
    }

    private [$updateValue]() {
        if (this.parent)
            this.parent[$updateAttribute](this);
    }

    protected onPropertyChange(_sender: any, args: PropertyChangeEventArgs) {
        if (args.property === VisualTreeAttribute.valueProperty)
            this[$updateValue]();
    }

    

    static valueProperty = DependencyProperty.register(VisualTreeAttribute, "value", { valueType: Type.get(String), defaultValue: "" });
    get value(): string { return Blender.execute(this, DependencyObject, o => o.get(VisualTreeAttribute.valueProperty)); }
    set value(value: string) { Blender.execute(this, DependencyObject, o => o.set(VisualTreeAttribute.valueProperty, value)); }
}