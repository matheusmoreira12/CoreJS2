import { InvalidOperationException, Destructible } from "../../Standard/index";
import { assertParams } from "../../Validation/index";
import { VisualTreeElement } from "./VisualTreeElement";
import { DependencyObject } from "../DependencyObjects/DependencyObject";

export abstract class VisualTreeNode extends Destructible {
    constructor(domNode: Node) {
        super();

        if (new.target === VisualTreeNode)
            throw new InvalidOperationException("Invalid constructor.");

        assertParams({ domNode }, Node);

        this.__domNode = domNode;

        this.DependencyObject = new DependencyObject();
    }

    DependencyObject: DependencyObject;

    get parent(): VisualTreeElement | null { return this.__parent; }
    __parent: VisualTreeElement | null = null;

    get domNode(): Node { return this.__domNode; }
    protected __domNode: Node;

    get namespaceURI(): string | null { return this.__domNode.namespaceURI; }

    get qualifiedName(): string { return this.__domNode.nodeName; }
}