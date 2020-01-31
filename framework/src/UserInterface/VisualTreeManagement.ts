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
    protected __domNode: Node;

    get namespaceURI(): string | null { return this.__domNode.namespaceURI; }

    get qualifiedName(): string { return this.__domNode.nodeName; }
}

export class VisualTreeElement extends VisualTreeNode {
    static create(qualifiedName: string, namespaceURI: string | null = null): VisualTreeElement {
        const domElement = document.createElementNS(namespaceURI, qualifiedName);
        return new VisualTreeElement(domElement);
    }

    constructor(domElement: Element) {
        super(domElement);

        if (!(domElement instanceof Element))
            throw new ArgumentTypeException("domElement", domElement, Element);

        this.__children.ChangeEvent.attach(this.__children_onChange, this);
        this.__attributes.ChangeEvent.attach(this.__attributes_onChange, this);
    }

    private __removeElement(element: VisualTreeElement) {
        (<Element>this.__domNode).removeChild(element.__domNode);
        element.__parent = null;
    }

    private __insertElement(element: VisualTreeElement, index: number) {
        if (element.parent)
            throw new InvalidOperationException("Cannot add attribute. The provided element already has a parent.");

        DOMUtils.insertElementAt(<Element>this.domNode, index, <Element>element.domNode);
        element.__parent = this;
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

    private __removeAttribute(attribute: VisualTreeAttribute) {
        (<Element>this.domNode).removeAttributeNode(<Attr>attribute.domNode);
        attribute.__parent = null;
    }

    private __addAttribute(attribute: VisualTreeAttribute) {
        if (attribute.parent)
            throw new InvalidOperationException("Cannot add attribute. The provided attribute already has a parent.");

        (<Element>this.domNode).setAttributeNodeNS(<Attr>attribute.domNode);
        attribute.__parent = this;
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
                    this.__addAttribute(item);
            }
        }
    }

    get attributes(): VisualTreeAttributeCollection { return this.__attributes; }
    protected __attributes: VisualTreeAttributeCollection = new VisualTreeAttributeCollection();

    destructor() {
        //Remove all elements
        const childrenCopy = [...this.children];
        for (let child of childrenCopy)
            !child.isDestructed && child.destruct();

        //Remove all attributes
        const attributesCopy = [...this.attributes];
        for (let attribute of attributesCopy)
            !attribute.isDestructed && attribute.destruct();

        //Remove self from parent
        if (this.parent)
            this.parent.children.remove(this);
    }
}

export class VisualTreeAttributeCollection extends ObservableCollection<VisualTreeAttribute> {
    get(qualifiedName: string, namespaceURI: string | null = null) {
        return this.find(a => a.qualifiedName === qualifiedName && a.namespaceURI === namespaceURI) || null;
    }

    create(qualifiedName: string, namespaceURI: string | null = null, initialValue?: string) {
        if (this.get(qualifiedName, namespaceURI))
            throw new InvalidOperationException("Cannot create attribute. An attribute with the specified name already exists in the same namespace.");

        const attribute = VisualTreeAttribute.create(qualifiedName, namespaceURI, initialValue);
        this.add(attribute);
        return attribute;
    }

    createMultiple(map: { [qualifiedName: string]: string }, namespaceURI: string | null = null) {
        for (let qualifiedName in map)
            this.create(qualifiedName, namespaceURI, map[qualifiedName]);
    }
}

export class VisualTreeAttribute extends VisualTreeNode {
    static create(qualifiedName: string, namespaceURI: string | null = null, initialValue?: string): VisualTreeAttribute {
        const domAttribute = document.createAttributeNS(namespaceURI, qualifiedName);
        const result = new VisualTreeAttribute(domAttribute);

        if (initialValue !== undefined)
            result.value = initialValue;

        return result;
    }

    constructor(domAttribute: Attr) {
        super(domAttribute);

        if (!(domAttribute instanceof Attr))
            throw new ArgumentTypeException("domAttribute", domAttribute, Element);
    }

    destructor() {
        //Remove self from parent
        if (this.parent)
            this.parent.attributes.remove(this);
    }

    get value(): string { return (<Attr>this.__domNode).value; }
    set value(value: string) { (<Attr>this.__domNode).value = value; }
}