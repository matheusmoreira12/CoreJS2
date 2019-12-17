const DEFAULT_NAMESPACE_URI = "http://www.w3.org/1999/xhtml";

export class VisualTreeNode {
    constructor(domNode) {
        if (this.constructor === VisualTreeNode) throw new InvalidOperationException("Invalid constructor.");

        if (!(domNode instanceof Node)) throw new ArgumentTypeException("domNode", domNode, Node);

        this.domNode = domNode;

        this.childNodes.ChangeEvent.attach(this._childNodes_onChange, this);
    }

    _insertElement(treeNode, index) {
        let domChildNodes = this.domNode.childNodes;

        if (domChildNodes.length > index) {
            let refNode = domChildNodes[index];

            this.domNode.insertBefore(treeNode.domNode, refNode);
        }
        else
            this.domNode.appendChild(treeNode.domNode);
    }

    _removeElement(treeNode) {
        treeNode.domNode.remove();
    }

    _setAttribute(treeNode) {
        this.domNode.setAttributeNodeNS(treeNode.domNode);
    }

    _removeAttribute(treeNode) {
        this.domNode.removeAttributeNode(treeNode.domNode);
    }

    _childNodes_onChange(sender, args) {
        if (Enumeration.isFlagSet(ObservableCollectionChangeAction.Remove, args.action)) {
            for (let item of args.oldItems) {
                if (item instanceof VisualTreeNode) {
                    if (item instanceof VisualTreeElement)
                        this._removeElement(item);
                    else if (item instanceof VisualTreeAttribute)
                        this._removeAttribute(item);
                }
                else
                    throw InvalidTypeException("item", item, VisualTreeNode);
            }
        }

        if (Enumeration.isFlagSet(ObservableCollectionChangeAction.Add, args.action)) {
            let index = args.newIndex;

            for (let item of args.newItems) {
                if (item instanceof VisualTreeNode) {
                    if (item instanceof VisualTreeElement)
                        this._insertElement(item, index);
                    else if (item instanceof VisualTreeAttribute)
                        this._setAttribute(item, index);
                }
                else
                    throw InvalidTypeException("item", item, VisualTreeNode);

                index++;
            }
        }
    }

    childNodes = new ObservableCollection();
}

export class VisualTreeElement extends VisualTreeNode {
    constructor(qualifiedName, namespaceURI = null) {
        namespaceURI = namespaceURI || DEFAULT_NAMESPACE_URI;

        if (typeof qualifiedName !== "string") throw new ArgumentTypeException("qualifiedName", qualifiedName, String);

        let domElement = document.createElementNS(namespaceURI, qualifiedName);
        super(domElement);
    }
}

export class VisualTreeAttribute extends VisualTreeNode {
    constructor(qualifiedName, namespaceURI = null) {
        namespaceURI = namespaceURI || DEFAULT_NAMESPACE_URI;

        if (typeof qualifiedName !== "string") throw new ArgumentTypeException("qualifiedName", qualifiedName, String);

        let domAttribute = document.createAttributeNS(namespaceURI, qualifiedName);
        super(domAttribute);
    }
}

export class VisualTree extends VisualTreeNode {
    constructor(rootNode) {
        super(rootNode);
    }

    async applyTemplate(template) {
        async function applyBinding(tempBinding) {
            for (let tempBinding of tempBindings) {
                if (tempBinding instanceof VisualTemplatePropertyBinding) {
                    let source = await ReferenceSystem.retrieve(tempBinding.sourceName, context);
                    let sourceProperty = await ReferenceSystem.retrieve(tempBinding.sourcePropertyName, context);

                    let target = await ReferenceSystem.retrieve(tempBinding.targetName, context);
                    let targetProperty = await ReferenceSystem.retrieve(tempBinding.targetPropertyName, context);

                    return new PropertyBinding(source, sourceProperty, target, targetProperty, tempBinding.options);
                }
                else if (tempBinding instanceof VisualTemplatePropertyAttributeBinding) {
                    let source = await ReferenceSystem.retrieve(tempBinding.sourceName, context);
                    let sourceProperty = await ReferenceSystem.retrieve(tempBinding.sourcePropertyName, context);

                    let targetNode = await ReferenceSystem.retrieve(tempBinding.targetqualifiedName, context);

                    return new PropertyAttributeBinding(source, sourceProperty, targetNode, tempBinding.targetAttributeName,
                        tempBinding.options);
                }
            }

            return null;
        }

        async function* applyBindings(tempBindings) {
            for (let tempBinding of tempBindings)
                yield await applyBinding(tempBinding);
        }

        async function applyNode(tempNode) {
            ReferenceSystem.deriveContext();

            if (tempNode instanceof VisualTemplateNode) {
                if (tempNode instanceof VisualTemplateElement) {
                    for (let childNode of await applyNodes(tempNode.children))
                        domNode.appendChild(domChild);
                }
            }
            else
                throw new InvalidTypeException("tempNode", tempNode, VisualTemplateNode);

            ReferenceSystem.freeContext();

            return domNode;
        }

        async function* applyNodes(tempNodes) {
            for (let tempNode of tempNodes) {
                let domNode = await applyNode(tempNode);

                if (tempNode.name)
                    ReferenceSystem.declare(tempNode.name, domNode);

                yield domNode;
            }
        }

        for (let node of await applyNodes())
            this.childNodes.add(node);
    }
}

window.VisualTree = VisualTree;
window.VisualTreeElement = VisualTreeElement;
window.VisualTreeAttribute = VisualTreeAttribute;