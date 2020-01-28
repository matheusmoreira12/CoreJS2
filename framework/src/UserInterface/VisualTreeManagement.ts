import { InvalidOperationException, ArgumentTypeException, InvalidTypeException } from "../Standard/Exceptions";
import { ObservableCollectionChangeArgs, ObservableCollectionChangeAction, ObservableCollection } from "../Standard/Collections/ObservableCollection";
import { Destructible } from "../Standard/index";

export abstract class VisualTreeNode extends Destructible {
    constructor(domNode: Node) {
        super();

        if (new.target === VisualTreeNode)
            throw new InvalidOperationException("Invalid constructor.");

        if (!(domNode instanceof Node))
            throw new ArgumentTypeException("domNode", domNode, Node);

        this.__domNode = domNode;
        this.__childNodes.ChangeEvent.attach(this.__childNodes_onChange, this);
    }

    private __insertElement(treeNode: VisualTreeNode, index: number) {
        const domChildNodes = this.__domNode.childNodes;
        if (domChildNodes.length > index) {
            const refNode = domChildNodes[index];
            this.__domNode.insertBefore(treeNode.domNode, refNode);
        }
        else
            this.__domNode.appendChild(treeNode.domNode);
    }

    private __removeElement(treeNode: VisualTreeNode) {
        const domNode = treeNode.__domNode;
        if (!domNode.parentNode)
            return;
        domNode.parentNode.removeChild(domNode);
    }

    private __setAttribute(treeNode: VisualTreeNode) {
        (<Element>this.__domNode).setAttributeNode(<Attr>treeNode.__domNode);
    }

    private __removeAttribute(treeNode: VisualTreeNode) {
        (<Element>this.__domNode).removeAttributeNode(<Attr>treeNode.__domNode);
    }

    private __childNodes_onChange(sender: any, args: ObservableCollectionChangeArgs<VisualTreeNode>) {
        if (ObservableCollectionChangeAction.contains(ObservableCollectionChangeAction.Remove, args.action)) {
            for (let item of args.oldItems) {
                if (item instanceof VisualTreeNode) {
                    if (item instanceof VisualTreeElement)
                        this.__removeElement(item);
                    else if (item instanceof VisualTreeAttribute)
                        this.__removeAttribute(item);
                }
                else
                    throw new InvalidTypeException("item", item, VisualTreeNode);
            }
        }

        if (ObservableCollectionChangeAction.contains(ObservableCollectionChangeAction.Add, args.action)) {
            let index = args.newIndex;
            for (let item of args.newItems) {
                if (item instanceof VisualTreeNode) {
                    if (item instanceof VisualTreeElement)
                        this.__insertElement(item, index);
                    else if (item instanceof VisualTreeAttribute)
                        this.__setAttribute(item);
                }
                else
                    throw new InvalidTypeException("item", item, VisualTreeNode);

                index++;
            }
        }
    }

    get childNodes(): ObservableCollection<VisualTreeNode> { return this.__childNodes; }
    protected __childNodes: ObservableCollection<VisualTreeNode> = new ObservableCollection();

    get domNode(): Node { return this.__domNode; }
    protected __domNode: Node;

    destructor() {
        //Remove all nodes
        this.childNodes.splice(0, this.childNodes.length);
    }
}

export class VisualTreeElement extends VisualTreeNode {
    create(qualifiedName: string, namespaceURI?: string | null) {
        if (namespaceURI === undefined)
            namespaceURI = null;

        if (namespaceURI !== null && typeof namespaceURI !== "string")
            throw new ArgumentTypeException("namespaceURI", namespaceURI, [String, null]);
        if (typeof qualifiedName !== "string")
            throw new ArgumentTypeException("qualifiedName", qualifiedName, String);

        let domElement = document.createElementNS(namespaceURI || null, qualifiedName);
        document.adoptNode(domElement);
        return new VisualTreeElement(domElement);
    }

    constructor(domElement: Element){
        if (!(domElement instanceof Element))
            throw new ArgumentTypeException("domElement", domElement, Element);

        super(domElement);
    }

    destructor() {

        super.destructor();
    }
}

export class VisualTreeAttribute extends VisualTreeNode {
    static create(qualifiedName: string, namespaceURI?: string | null) {
        if (namespaceURI === undefined)
            namespaceURI = null;

        if (namespaceURI !== null && typeof namespaceURI !== "string")
            throw new ArgumentTypeException("namespaceURI", qualifiedName, [String, null]);
        if (typeof qualifiedName !== "string")
            throw new ArgumentTypeException("qualifiedName", qualifiedName, String);

        const domAttribute = document.createAttributeNS(namespaceURI || null, qualifiedName);
        document.adoptNode(domAttribute);
        return new VisualTreeAttribute(domAttribute);
    }

    constructor(domAttribute: Attr) {
        if (!(domAttribute instanceof Attr))
            throw new ArgumentTypeException("domAttribute", domAttribute, Attr);

        super(domAttribute);
    }

    destructor() {

        super.destructor();
    }
}

export class VisualTree extends VisualTreeNode {
    constructor(rootNode: ShadowRoot) {
        super(rootNode);
    }

    destructor() {

        super.destructor();
    }
}