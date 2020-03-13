import { VisualTreeNode } from "./VisualTreeNode";
import { InvalidOperationException, Enumeration, FrameworkException } from "../../Standard/index";
import { ObservableCollectionChangeArgs, ObservableCollectionChangeAction, ObservableCollection } from "../../Standard/Collections/index";
import { DOMUtils } from "../index";
import { VisualTreeAttribute } from "./VisualTreeAttribute";
import { VisualTreeAttributeCollection } from "./VisualTreeAttributeCollection";
import { assertParams } from "../../Validation/index";
import { DependencyObject } from "../DependencyObjects/DependencyObject";
import { PropertyChangeEventArgs } from "../DependencyObjects/index";
import { Blender } from "../../Standard/Blender/Blender";

export class VisualTreeElement extends VisualTreeNode {
    static create(qualifiedName: string, namespaceURI: string | null = null): VisualTreeElement {
        assertParams({ qualifiedName }, [String]);
        assertParams({ namespaceURI }, [String, null]);

        const domElement = document.createElementNS(namespaceURI, qualifiedName);
        return new VisualTreeElement(domElement);
    }

    constructor(domElement: Element) {
        super(domElement);

        assertParams({ domElement }, [Element]);

        this.__children.ChangeEvent.attach(this.__children_onChange, this);
        this.__attributes.ChangeEvent.attach(this.__attributes_onChange, this);

        //Blend with DependencyObject
        if (Blender.blend(DependencyObject, this))
            Blender.initialize(this, DependencyObject);
        else
            throw new FrameworkException("Failed to blend with DependencyObject.");
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
        if (Enumeration.contains(ObservableCollectionChangeAction.Remove, args.action)) {
            for (let item of args.oldItems) {
                if (item instanceof VisualTreeElement)
                    this.__removeElement(item);
            }
        }

        if (Enumeration.contains(ObservableCollectionChangeAction.Add, args.action)) {
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
        if (Enumeration.contains(ObservableCollectionChangeAction.Remove, args.action)) {
            for (let item of args.oldItems) {
                if (item instanceof VisualTreeAttribute)
                    this.__removeAttribute(item);
            }
        }

        if (Enumeration.contains(ObservableCollectionChangeAction.Add, args.action)) {
            for (let item of args.newItems) {
                if (item instanceof VisualTreeAttribute)
                    this.__addAttribute(item);
            }
        }
    }

    get attributes(): VisualTreeAttributeCollection { return this.__attributes; }
    protected __attributes: VisualTreeAttributeCollection = new VisualTreeAttributeCollection();

    protected destructor() {
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

        if (!Blender.deblend(this, DependencyObject))
            throw new FrameworkException("Failed to de-blend from DependencyObject.");
    }
}