import { InvalidOperationException, ArgumentTypeException, InvalidTypeException } from "../Standard/Exceptions";
import { ObservableCollectionChangeArgs, ObservableCollectionChangeAction, ObservableCollection } from "../Standard/Collections/ObservableCollection";
import { Destructible } from "../Standard/index";

export abstract class VisualTreeNode extends Destructible {
    static createElement(qualifiedName: string, namespaceURI?: string | null) {
        if (typeof qualifiedName !== "string")
            throw new ArgumentTypeException("qualifiedName", qualifiedName, String);

        if (namespaceURI === undefined)
            return document.createElement(qualifiedName);

        if (namespaceURI !== null && typeof namespaceURI !== "string")
            throw new ArgumentTypeException("namespaceURI", namespaceURI, [String, null]);

        return document.createElementNS(namespaceURI, qualifiedName);
    }

    static createAttribute(qualifiedName: string, namespaceURI?: string | null) {
        if (typeof qualifiedName !== "string")
            throw new ArgumentTypeException("qualifiedName", qualifiedName, String);

        if (namespaceURI === undefined)
            return document.createAttribute(qualifiedName);

        if (namespaceURI !== null && typeof namespaceURI !== "string")
            throw new ArgumentTypeException("namespaceURI", qualifiedName, [String, null]);

        return document.createAttributeNS(namespaceURI, qualifiedName);
    }

    constructor(domNode: Node) {
        super();

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
                    if (item.__domNode instanceof Element)
                        this.__removeElement(item);
                    else if (item.__domNode instanceof Attr)
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
                    if (item.__domNode instanceof Element)
                        this.__insertElement(item, index);
                    else if (item.__domNode instanceof Attr)
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
        for (let childNode of this.childNodes)
            childNode.destruct();

        this.childNodes.splice(0, this.childNodes.length);
    }
}