import { Destructible, InvalidOperationException } from "../../Standard/index";
import { assertParams } from "../../Validation/index";
import { VisualTreeElement } from "./VisualTreeElement";
import { DependencyObject } from "../DependencyObjects/index";
import { applyMixin } from "../../CoreBase/Utils/ObjectUtils";

export abstract class VisualTreeNode extends Destructible implements DependencyObject {
    constructor(domNode: Node) {
        super();

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

export interface VisualTreeNode extends Destructible, DependencyObject { }
applyMixin(VisualTreeNode, DependencyObject);