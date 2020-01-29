import { ArgumentTypeException, InvalidTypeException, InvalidOperationException } from "../Standard/Exceptions";
import { ObservableCollectionChangeArgs, ObservableCollectionChangeAction, ObservableCollection } from "../Standard/Collections/ObservableCollection";
import { Destructible } from "../Standard/index";
import { DOMUtils } from "./index";

export abstract class VisualTreeNode extends Destructible {
    constructor(domNode: Node) {
        super();

        if (new.target === VisualTreeNode)
            throw new InvalidOperationException("Invalid constructor.");

        if (!(domNode instanceof Node))
            throw new ArgumentTypeException("domNode", domNode, Node);

        this.__domNode = domNode;
    }

    get parent(): VisualTreeElement | null { return this.__parent; }
    protected __parent: VisualTreeElement | null = null;

    get domNode(): Node { return this.__domNode; }
    private __domNode: Node;
}

export class VisualTreeElement extends VisualTreeNode {
    static create(qualifiedName: string, namespaceURI?: string | null) {
        if (typeof qualifiedName !== "string")
            throw new ArgumentTypeException("qualifiedName", qualifiedName, String);

        if (namespaceURI === undefined)
            return document.createElement(qualifiedName);

        if (namespaceURI !== null && typeof namespaceURI !== "string")
            throw new ArgumentTypeException("namespaceURI", namespaceURI, [String, null]);

        return document.createElementNS(namespaceURI, qualifiedName);
    }

    constructor(domElement: Element) {
        super(domElement);

        if (!(domElement instanceof Element))
            throw new ArgumentTypeException("domElement", domElement, Element);

        this.__children.ChangeEvent.attach(this.__children_onChange, this);
        this.__attributes.ChangeEvent.attach(this.__attributes_onChange, this);
    }

    private __insertElement(treeElement: VisualTreeElement, index: number) {
        DOMUtils.insertElementAt(<Element>this.domNode, index, <Element>treeElement.domNode);

        treeElement.parent?.__removeElement(treeElement);
        treeElement.__parent = this;
    }

    private __removeElement(treeElement: VisualTreeElement) {
        const domElement = <Element>treeElement.domNode;
        domElement?.parentElement?.removeChild(domElement);

        treeElement.__parent = null;
    }

    private __children_onChange(sender: any, args: ObservableCollectionChangeArgs<VisualTreeElement>) {
        if (ObservableCollectionChangeAction.contains(ObservableCollectionChangeAction.Remove, args.action)) {
            for (let item of args.oldItems) {
                if (item instanceof VisualTreeElement)
                    this.__removeElement(item);
            }
        }

        if (ObservableCollectionChangeAction.contains(ObservableCollectionChangeAction.Add, args.action)) {
            let index = args.newIndex;
            for (let item of args.newItems) {
                if (item instanceof VisualTreeElement)
                    this.__insertElement(item, index);
                index++;
            }
        }
    }

    get children(): ObservableCollection<VisualTreeElement> { return this.__children; }
    protected __children: ObservableCollection<VisualTreeElement> = new ObservableCollection();

    private __removeAttribute(item: VisualTreeAttribute) {
        (<Element>this.domNode).removeAttributeNode(<Attr>item.domNode);
    }

    private __setAttribute(item: VisualTreeAttribute) {
        (<Element>this.domNode).setAttributeNodeNS(<Attr>item.domNode);
    }

    private __attributes_onChange(sender: any, args: ObservableCollectionChangeArgs<VisualTreeAttribute>) {
        if (ObservableCollectionChangeAction.contains(ObservableCollectionChangeAction.Remove, args.action)) {
            for (let item of args.oldItems) {
                if (item instanceof VisualTreeAttribute)
                    this.__removeAttribute(item);
            }
        }

        if (ObservableCollectionChangeAction.contains(ObservableCollectionChangeAction.Add, args.action)) {
            for (let item of args.newItems) {
                if (item instanceof VisualTreeAttribute)
                    this.__setAttribute(item);
            }
        }
    }

    get attributes(): ObservableCollection<VisualTreeElement> { return this.__attributes; }
    protected __attributes: ObservableCollection<VisualTreeElement> = new ObservableCollection();

    destructor() {
        //Remove all elements
        for (let child of this.children)
            !child.isDestructed && child.destruct();

        //Remove all attributes
        for (let attribute of this.attributes)
            !attribute.isDestructed && attribute.destruct();

        (<Element>this.domNode)?.remove();
    }
}

export class VisualTreeAttribute extends VisualTreeNode {
    static create(qualifiedName: string, namespaceURI?: string | null) {
        if (typeof qualifiedName !== "string")
            throw new ArgumentTypeException("qualifiedName", qualifiedName, String);

        if (namespaceURI === undefined)
            return document.createAttribute(qualifiedName);

        if (namespaceURI !== null && typeof namespaceURI !== "string")
            throw new ArgumentTypeException("namespaceURI", namespaceURI, [String, null]);

        return document.createAttributeNS(namespaceURI, qualifiedName);
    }

    constructor(domAttribute: Attr) {
        super(domAttribute);

        if (!(domAttribute instanceof Element))
            throw new ArgumentTypeException("domElement", domAttribute, Element);
    }

    destructor() {
        const domAttribute = <Attr>this.domNode;
        domAttribute?.parentElement?.removeAttributeNode(domAttribute);
    }
}