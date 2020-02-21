import { Destructible, InvalidOperationException } from "../../Standard/index";
import { assertParams } from "../../Validation/index";
import { VisualTreeElement } from "./VisualTreeElement";

export abstract class VisualTreeNode {
    constructor(domNode: Node) {
        if (new.target === VisualTreeNode)
            throw new InvalidOperationException("Invalid constructor.");

        assertParams({ domNode }, Node);

        this.__domNode = domNode;
    }

    get parent(): VisualTreeElement | null { return this.__parent; }
    __parent: VisualTreeElement | null = null;

    get domNode(): Node { return this.__domNode; }
    protected __domNode: Node;

    get namespaceURI(): string | null { return this.__domNode.namespaceURI; }

    get qualifiedName(): string { return this.__domNode.nodeName; }
}