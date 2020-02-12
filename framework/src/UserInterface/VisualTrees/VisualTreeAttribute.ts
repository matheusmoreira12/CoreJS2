import { VisualTreeNode } from "./VisualTreeNode";
import { assertParams } from "../../Validation/index";

export class VisualTreeAttribute extends VisualTreeNode {
    static create(qualifiedName: string, namespaceURI: string | null = null, initialValue?: string): VisualTreeAttribute {
        assertParams({ qualifiedName }, String);
        assertParams({ namespaceURI }, String, null);
        assertParams({ initialValue }, String, undefined);

        const domAttribute = document.createAttributeNS(namespaceURI, qualifiedName);
        const result = new VisualTreeAttribute(domAttribute);

        if (initialValue !== undefined)
            result.value = initialValue;

        return result;
    }

    constructor(domAttribute: Attr) {
        assertParams({ domAttribute }, Attr);

        super(domAttribute);
    }

    destructor() {
        //Remove self from parent
        if (this.parent)
            this.parent.attributes.remove(this);
    }

    get value(): string { return (<Attr>this.__domNode).value; }
    set value(value: string) { (<Attr>this.__domNode).value = value; }
}