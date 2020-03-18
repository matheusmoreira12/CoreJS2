import { VisualTreeNode, $unsetParent, $setParent } from "./VisualTreeNode";
import { InvalidOperationException, Enumeration } from "../../Standard/index";
import { ObservableCollectionChangeArgs, ObservableCollectionChangeAction, ObservableCollection } from "../../Standard/Collections/index";
import { DOMUtils } from "../index";
import { VisualTreeAttribute } from "./VisualTreeAttribute";
import { VisualTreeAttributeCollection } from "./VisualTreeAttributeCollection";

//Public keys for VisualTreeElement
export const $updateAttribute = Symbol("updateAttribute");

//Keys for VisualTreeElement
export const $attributes = Symbol("attributes");
export const $attributes_onChange = Symbol("attributes_onChange");
export const $addAttribute = Symbol("addAttribute");
export const $removeAttribute = Symbol("removeAttribute");
export const $children = Symbol("children");
export const $children_onChange = Symbol("children_onChange");
export const $insertChild = Symbol("insertElement");
export const $removeChild = Symbol("removeElement");
export const $domElement = Symbol("domElement");

export class VisualTreeElement extends VisualTreeNode {
    static create(qualifiedName: string, namespaceURI: string | null = null): VisualTreeElement {
        const domElement = document.createElementNS(namespaceURI, qualifiedName);
        const element = new VisualTreeElement(qualifiedName, namespaceURI);
        element[$domElement] = domElement;
        element.initialize();
        return element;
    }

    constructor(qualifiedName: string, namespaceURI: string | null = null) {
        super(qualifiedName, namespaceURI);

        this[$children].ChangeEvent.attach(this[$children_onChange], this);
        this[$attributes].ChangeEvent.attach(this[$attributes_onChange], this);
    }

    protected initialize(): void { }
    protected finalize(): void { }

    private [$removeChild](element: VisualTreeElement) {
        (<Element>this[$domElement]).removeChild(<Element>element[$domElement]);
        element[$unsetParent]();
    }

    private [$insertChild](element: VisualTreeElement, index: number) {
        if (element.parent)
            throw new InvalidOperationException("Cannot add attribute. The provided element already has a parent.");

        DOMUtils.insertElementAt(<Element>this.domElement, index, <Element>element.domElement);
        element[$setParent](this);
    }

    private [$children_onChange](sender: any, args: ObservableCollectionChangeArgs<VisualTreeElement>) {
        if (Enumeration.contains(ObservableCollectionChangeAction.Remove, args.action)) {
            for (let item of args.oldItems) {
                if (item instanceof VisualTreeElement)
                    this[$removeChild](item);
            }
        }

        if (Enumeration.contains(ObservableCollectionChangeAction.Add, args.action)) {
            let index = args.newIndex;
            for (let item of args.newItems) {
                if (item instanceof VisualTreeElement)
                    this[$insertChild](item, index);
                index++;
            }
        }
    }

    get children(): ObservableCollection<VisualTreeElement> { return this[$children]; }
    protected [$children]: ObservableCollection<VisualTreeElement> = new ObservableCollection();

    private [$removeAttribute](attribute: VisualTreeAttribute) {
        (<Element>this.domElement).removeAttributeNS(attribute.namespaceURI, attribute.qualifiedName);
        attribute[$unsetParent]();
    }

    private [$addAttribute](attribute: VisualTreeAttribute) {
        if (attribute.parent)
            throw new InvalidOperationException("Cannot add attribute. The provided attribute already has a parent.");

        (<Element>this.domElement).setAttributeNS(attribute.namespaceURI, attribute.qualifiedName, attribute.value);
    }

    [$updateAttribute](attribute: VisualTreeAttribute, value: any) {
        (<Element>this.domElement).setAttributeNS(attribute.namespaceURI, attribute.qualifiedName, value);
    }

    private [$attributes_onChange](sender: any, args: ObservableCollectionChangeArgs<VisualTreeAttribute>) {
        if (Enumeration.contains(ObservableCollectionChangeAction.Remove, args.action)) {
            for (let item of args.oldItems) {
                if (item instanceof VisualTreeAttribute)
                    this[$removeAttribute](item);
            }
        }

        if (Enumeration.contains(ObservableCollectionChangeAction.Add, args.action)) {
            for (let item of args.newItems) {
                if (item instanceof VisualTreeAttribute)
                    this[$addAttribute](item);
            }
        }
    }

    get attributes(): VisualTreeAttributeCollection { return this[$attributes]; }
    protected [$attributes]: VisualTreeAttributeCollection = new VisualTreeAttributeCollection();

    get domElement(): Element | null { return this[$domElement]; }
    protected [$domElement]: Element | null;

    protected destructor() {
        this.finalize();

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