import { InvalidOperationException, ArgumentTypeException, InvalidTypeException } from "../Standard/Exceptions";
import { ObservableCollectionChangeAction, ObservableCollection } from "../Standard/Collections";
const DEFAULT_NAMESPACE_URI = "http://www.w3.org/1999/xhtml";
export class VisualTreeNode {
    constructor(domNode) {
        this.__childNodes = new ObservableCollection();
        if (new.target === VisualTreeNode)
            throw new InvalidOperationException("Invalid constructor.");
        if (!(domNode instanceof Node))
            throw new ArgumentTypeException("domNode", domNode, Node);
        this.__domNode = domNode;
        this.__childNodes.ChangeEvent.attach(this.__childNodes_onChange, this);
    }
    __insertElement(treeNode, index) {
        let domChildNodes = this.__domNode.childNodes;
        if (domChildNodes.length > index) {
            let refNode = domChildNodes[index];
            this.__domNode.insertBefore(treeNode.domNode, refNode);
        }
        else
            this.__domNode.appendChild(treeNode.domNode);
    }
    __removeElement(treeNode) {
        const domNode = treeNode.__domNode;
        domNode.parentNode.removeChild(domNode);
    }
    __setAttribute(treeNode) {
        this.__domNode.appendChild(treeNode.__domNode);
    }
    __removeAttribute(treeNode) {
        this.__domNode.appendChild(treeNode.__domNode);
    }
    __childNodes_onChange(sender, args) {
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
    get childNodes() { return this.__childNodes; }
    get domNode() { return this.__domNode; }
}
export class VisualTreeElement extends VisualTreeNode {
    constructor(qualifiedName, namespaceURI = null) {
        namespaceURI = namespaceURI || DEFAULT_NAMESPACE_URI;
        if (typeof qualifiedName !== "string")
            throw new ArgumentTypeException("qualifiedName", qualifiedName, String);
        let domElement = document.createElementNS(namespaceURI, qualifiedName);
        super(domElement);
    }
}
export class VisualTreeAttribute extends VisualTreeNode {
    constructor(qualifiedName, namespaceURI = null) {
        namespaceURI = namespaceURI || DEFAULT_NAMESPACE_URI;
        if (typeof qualifiedName !== "string")
            throw new ArgumentTypeException("qualifiedName", qualifiedName, String);
        let domAttribute = document.createAttributeNS(namespaceURI, qualifiedName);
        super(domAttribute);
    }
}
export class VisualTree extends VisualTreeNode {
    constructor(rootNode) {
        super(rootNode);
    }
}
