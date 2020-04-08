import { VisualTreeNode, $setParent } from "./VisualTreeNode.js";
import { InvalidOperationException, Enumeration } from "../../Standard/index.js";
import { ObservableCollectionChangeArgs, ObservableCollectionChangeAction, ObservableCollection } from "../../Standard/Collections/index.js";
import { DOMUtils } from "../index.js";
import { VisualTreeAttribute } from "./VisualTreeAttribute.js";
import { VisualTreeAttributeCollection } from "./VisualTreeAttributeCollection.js";

//Public keys for VisualTreeElement
export const $updateAttribute = Symbol("updateAttribute");

//Keys for VisualTreeElement
const $attributes = Symbol("attributes");
const $attributes_onChange = Symbol("attributes_onChange");
const $addAttribute = Symbol("addAttribute");
const $removeAttribute = Symbol("removeAttribute");
const $children = Symbol("children");
const $children_onChange = Symbol("children_onChange");
const $insertChild = Symbol("insertElement");
const $removeChild = Symbol("removeElement");
const $domElement = Symbol("domElement");
const $isInitialized = Symbol("isInitialized");

export class VisualTreeElement extends VisualTreeNode {
    static create(qualifiedName: string, namespaceURI: string | null = null): VisualTreeElement {
        const domElement = document.createElementNS(namespaceURI, qualifiedName);
        const element = new VisualTreeElement(qualifiedName, namespaceURI);
        element.initialize(domElement);
        return element;
    }

    constructor(qualifiedName: string, namespaceURI: string | null = null) {
        super(qualifiedName, namespaceURI);

        this[$children].ChangeEvent.attach(this[$children_onChange], this);
        this[$attributes].ChangeEvent.attach(this[$attributes_onChange], this);
    }

    protected __initialization(): void { }

    protected __finalization(): void {
        //Remove all elements
        const childrenCopy = [...this.children];
        for (let child of childrenCopy)
            !child.isDestructed && child.destruct();

        //Remove all attributes
        const attributesCopy = [...this.attributes];
        for (let attribute of attributesCopy)
            !attribute.isDestructed && attribute.destruct();
    }

    initialize(domElement: Element) {
        if (this[$isInitialized])
            throw new InvalidOperationException("Cannot initialize VisualTreeElement instance. This VisualTreeElement instance has already been initialized.");
        else {
            this[$domElement] = domElement;
            this.__initialization();
            this[$isInitialized] = true;
        }
    }

    finalize() {
        if (!this[$isInitialized])
            throw new InvalidOperationException("Cannot finalize VisualTreeElement instance. This VisualTreeElement instance has not been initialized.");
        else {
            this.__initialization();
            this[$isInitialized] = true;
        }
    }

    get isInitialized() { return this[$isInitialized]; }
    private [$isInitialized]: boolean = false;

    private [$removeChild](element: VisualTreeElement) {
        (<Element>this[$domElement]).removeChild(<Element>element[$domElement]);
        element[$setParent](null);
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
        attribute[$setParent](null);
    }

    private [$addAttribute](attribute: VisualTreeAttribute) {
        if (attribute.parent)
            throw new InvalidOperationException("Cannot add attribute. The provided attribute already has a parent.");
        attribute[$setParent](this);
        this[$updateAttribute](attribute);
    }

    [$updateAttribute](attribute: VisualTreeAttribute) {
        (<Element>this.domElement).setAttributeNS(attribute.namespaceURI, attribute.qualifiedName, attribute.value);
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

    get domElement(): Element { return this[$domElement]; }
    protected [$domElement]!: Element;

    protected destructor() {
        if (this.isInitialized)
            this.finalize();

        //Remove self from parent
        if (this.parent)
            this.parent.children.remove(this);
    }
}