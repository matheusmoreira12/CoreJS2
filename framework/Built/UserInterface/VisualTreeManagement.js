"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Exceptions_1 = require("../Standard/Exceptions");
const Collections_1 = require("../Standard/Collections");
const DEFAULT_NAMESPACE_URI = "http://www.w3.org/1999/xhtml";
class VisualTreeNode {
    constructor(domNode) {
        this.__childNodes = new Collections_1.ObservableCollection();
        if (new.target === VisualTreeNode)
            throw new Exceptions_1.InvalidOperationException("Invalid constructor.");
        if (!(domNode instanceof Node))
            throw new Exceptions_1.ArgumentTypeException("domNode", domNode, Node);
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
        if (Collections_1.ObservableCollectionChangeAction.contains(Collections_1.ObservableCollectionChangeAction.Remove, args.action)) {
            for (let item of args.oldItems) {
                if (item instanceof VisualTreeNode) {
                    if (item instanceof VisualTreeElement)
                        this.__removeElement(item);
                    else if (item instanceof VisualTreeAttribute)
                        this.__removeAttribute(item);
                }
                else
                    throw new Exceptions_1.InvalidTypeException("item", item, VisualTreeNode);
            }
        }
        if (Collections_1.ObservableCollectionChangeAction.contains(Collections_1.ObservableCollectionChangeAction.Add, args.action)) {
            let index = args.newIndex;
            for (let item of args.newItems) {
                if (item instanceof VisualTreeNode) {
                    if (item instanceof VisualTreeElement)
                        this.__insertElement(item, index);
                    else if (item instanceof VisualTreeAttribute)
                        this.__setAttribute(item);
                }
                else
                    throw new Exceptions_1.InvalidTypeException("item", item, VisualTreeNode);
                index++;
            }
        }
    }
    get childNodes() { return this.__childNodes; }
    get domNode() { return this.__domNode; }
}
exports.VisualTreeNode = VisualTreeNode;
class VisualTreeElement extends VisualTreeNode {
    constructor(qualifiedName, namespaceURI = null) {
        namespaceURI = namespaceURI || DEFAULT_NAMESPACE_URI;
        if (typeof qualifiedName !== "string")
            throw new Exceptions_1.ArgumentTypeException("qualifiedName", qualifiedName, String);
        let domElement = document.createElementNS(namespaceURI, qualifiedName);
        super(domElement);
    }
}
exports.VisualTreeElement = VisualTreeElement;
class VisualTreeAttribute extends VisualTreeNode {
    constructor(qualifiedName, namespaceURI = null) {
        namespaceURI = namespaceURI || DEFAULT_NAMESPACE_URI;
        if (typeof qualifiedName !== "string")
            throw new Exceptions_1.ArgumentTypeException("qualifiedName", qualifiedName, String);
        let domAttribute = document.createAttributeNS(namespaceURI, qualifiedName);
        super(domAttribute);
    }
}
exports.VisualTreeAttribute = VisualTreeAttribute;
class VisualTree extends VisualTreeNode {
    constructor(rootNode) {
        super(rootNode);
    }
}
exports.VisualTree = VisualTree;
