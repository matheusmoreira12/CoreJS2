import { InvalidOperationException, ArgumentTypeException, InvalidTypeException } from "../Standard/Exceptions.js";
import { ObservableCollectionChangeArgs, ObservableCollectionChangeAction, ObservableCollection } from "../Standard/Collections/ObservableCollection.js";

const DEFAULT_NAMESPACE_URI = "http://www.w3.org/1999/xhtml";

export abstract class VisualTreeNode {
    constructor(domNode: Node) {
        if (new.target === VisualTreeNode)
            throw new InvalidOperationException("Invalid constructor.");

        if (!(domNode instanceof Node))
            throw new ArgumentTypeException("domNode", domNode, Node);

        this.__domNode = domNode;
        this.__childNodes.ChangeEvent.attach(this.__childNodes_onChange, this);
    }

    private __insertElement(treeNode, index) {
        let domChildNodes = this.__domNode.childNodes;

        if (domChildNodes.length > index) {
            let refNode = domChildNodes[index];

            this.__domNode.insertBefore(treeNode.domNode, refNode);
        }
        else
            this.__domNode.appendChild(treeNode.domNode);
    }

    private __removeElement(treeNode: VisualTreeNode) {
        const domNode = treeNode.__domNode;
        domNode.parentNode.removeChild(domNode);
    }

    private __setAttribute(treeNode: VisualTreeNode) {
        this.__domNode.appendChild(treeNode.__domNode);
    }

    private __removeAttribute(treeNode: VisualTreeNode) {
        this.__domNode.appendChild(treeNode.__domNode);
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

    ///TODO: Re-implement template system
    //async applyTemplate(template): void {
    //    async function* applyBindings(tempBindings: Iterable<VisualTemplateBinding>): Generator<Binding> {
    //        async function applyBinding(tempBinding: VisualTemplateBinding): Binding {
    //            if (tempBinding instanceof VisualTemplatePropertyBinding) {
    //                let source = await ReferenceSystem.retrieve(tempBinding.sourceName, context);
    //                let sourceProperty = await ReferenceSystem.retrieve(tempBinding.sourcePropertyName, context);

    //                let target = await ReferenceSystem.retrieve(tempBinding.targetName, context);
    //                let targetProperty = await ReferenceSystem.retrieve(tempBinding.targetPropertyName, context);

    //                return new PropertyBinding(source, sourceProperty, target, targetProperty, tempBinding.options);
    //            }
    //            else if (tempBinding instanceof VisualTemplatePropertyAttributeBinding) {
    //                let source = await ReferenceSystem.retrieve(tempBinding.sourceName, context);
    //                let sourceProperty = await ReferenceSystem.retrieve(tempBinding.sourcePropertyName, context);

    //                let targetNode = await ReferenceSystem.retrieve(tempBinding.targetqualifiedName, context);

    //                return new PropertyAttributeBinding(source, sourceProperty, targetNode, tempBinding.targetAttributeName,
    //                    tempBinding.options);
    //            }

    //            return null;
    //        }

    //        for (let tempBinding of tempBindings)
    //            yield await applyBinding(tempBinding);
    //    }

    //    async function applyNode(tempNode: VisualTemplateNode): Promise<VisualTreeNode> {
    //        ReferenceSystem.deriveContext();

    //        if (tempNode instanceof VisualTemplateNode) {
    //            if (tempNode instanceof VisualTemplateElement) {
    //                for (let childNode of await applyNodes(tempNode.childNodes))
    //                    domNode.appendChild(domChild);
    //            }
    //        }
    //        else
    //            throw new InvalidTypeException("tempNode", tempNode, VisualTemplateNode);

    //        ReferenceSystem.freeContext();

    //        return domNode;
    //    }

    //    async function* applyNodes(tempNodes: Iterable<VisualTemplateNode>) {
    //        for (let tempNode of tempNodes) {
    //            let domNode = await applyNode(tempNode);

    //            if (tempNode.name)
    //                ReferenceSystem.declare(tempNode.name, domNode);

    //            yield domNode;
    //        }
    //    }

    //    for (let node of await applyNodes())
    //        this.childNodes.add(node);
    //}
}