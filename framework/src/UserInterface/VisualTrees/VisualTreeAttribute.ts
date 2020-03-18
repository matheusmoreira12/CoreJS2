import { VisualTreeNode } from "./VisualTreeNode";
import { assertParams } from "../../Validation/index";
import { DependencyProperty, PropertyChangeEventArgs, DependencyObject } from "../DependencyObjects/index";
import { Type } from "../../Standard/Types/Type";
import { Blender } from "../../Standard/Blender/index";
import { $updateAttribute } from "./index";

const $updateValue = Symbol("updateValue");

export class VisualTreeAttribute extends VisualTreeNode {
    constructor(qualifiedName: string, namespaceURI: string | null = null, initialValue?: string) {
        super(qualifiedName, namespaceURI);

        assertParams({ qualifiedName }, [String]);
        assertParams({ namespaceURI }, [String, null]);
        assertParams({ initialValue }, [String, undefined]);

        this.value = String(initialValue) || "";
    }

    private [$updateValue](value: string) {
        if (this.parent)
            this.parent[$updateAttribute](this, value);
    }

    protected onPropertyChange(_sender: any, args: PropertyChangeEventArgs) {
        if (args.property === VisualTreeAttribute.valueProperty)
            this[$updateValue](String(args.newValue));
    }

    static valueProperty = DependencyProperty.register(<any>VisualTreeAttribute, "", { valueType: Type.get(String), defaultValue: "" });
    get value(): string { return Blender.execute(this, DependencyObject, o => o.get(VisualTreeAttribute.valueProperty)); }
    set value(value: string) { Blender.execute(this, DependencyObject, o => o.set(VisualTreeAttribute.valueProperty, value)); }

    protected destructor() {
        //Remove self from parent
        if (this.parent)
            this.parent.attributes.remove(this);
    }
}