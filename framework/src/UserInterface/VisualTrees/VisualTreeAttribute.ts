import { VisualTreeNode } from "./VisualTreeNode";
import { assertParams } from "../../Validation/index";
import { DependencyProperty, PropertyChangeEventArgs, DependencyObject } from "../DependencyObjects/index";
import { Type } from "../../Standard/Types/Type";
import { Blender } from "../../Standard/index";

export class VisualTreeAttribute extends VisualTreeNode {
    constructor(qualifiedName: string, namespaceURI: string | null = null, initialValue?: string) {
        super(qualifiedName, namespaceURI);

        assertParams({ qualifiedName }, [String]);
        assertParams({ namespaceURI }, [String, null]);
        assertParams({ initialValue }, [String, undefined]);

        if (initialValue !== undefined)
            this.value = this.value;
    }

    destructor() {
        //Remove self from parent
        if (this.parent)
            this.parent.attributes.remove(this);
    }

    private __updateValue(value: string) {
    }

    protected onPropertyChange(_sender: any, args: PropertyChangeEventArgs) {
        if (args.property === VisualTreeAttribute.valueProperty)
            __updateValue(String(args.newValue));
    }

    static valueProperty = DependencyProperty.register(<any>VisualTreeAttribute, "", { valueType: Type.get(String), defaultValue: "" });
    get value(): string { return Blender.execute(); }
    set value(value: string) { (<Attr>this.__domNode).value = value; }
    }