import { ArgumentTypeException, InvalidTypeException } from "../Standard/Exceptions";
import { ObservableCollectionChangeArgs, ObservableCollectionChangeAction, ObservableCollection } from "../Standard/Collections/ObservableCollection";
import { Destructible } from "../Standard/index";
import { Dictionary, ObservableDictionaryChangeArgs } from "../Standard/Collections/index";
import { insertElementAt } from "./DOMUtils";

const domElements: Dictionary<VisualTreeElement, Element> = new Dictionary();
const domAttributes: Dictionary<VisualTreeAttribute, Attr> = new Dictionary();

export class VisualTreeElement extends Destructible {
    static create(qualifiedName: string, namespaceURI?: string | null) {
        if (typeof qualifiedName !== "string")
            throw new ArgumentTypeException("qualifiedName", qualifiedName, String);

        if (namespaceURI === undefined)
            return document.createElement(qualifiedName);

        if (namespaceURI !== null && typeof namespaceURI !== "string")
            throw new ArgumentTypeException("namespaceURI", namespaceURI, [String, null]);

        return document.createElementNS(namespaceURI, qualifiedName);
    }

    static getByDomElement(domElement: Element): VisualTreeElement | null {
        return domElements.invert().get(domElement) || null;
    }

    constructor(domElement: Element) {
        super();

        if (!(domElement instanceof Element))
            throw new ArgumentTypeException("domElement", domElement, Element);

        this.__children.ChangeEvent.attach(this.__childElements_onChange, this);

        domElements.set(this, domElement);
    }

    private __insertElement(treeElement: VisualTreeElement, index: number) {
        const domElement = treeElement?.domElement;
        if (!domElement)
            return;
        insertElementAt(<Element>this.domElement, index, domElement)
    }

    private __removeElement(treeElement: VisualTreeElement) {
        const domElement = treeElement.domElement;
        domElement?.parentElement?.removeChild(domElement);
    }

    private __childElements_onChange(sender: any, args: ObservableCollectionChangeArgs<VisualTreeElement>) {
        if (ObservableCollectionChangeAction.contains(ObservableCollectionChangeAction.Remove, args.action)) {
            for (let item of args.oldItems) {
                if (item instanceof VisualTreeElement) {
                    if (item instanceof VisualTreeElement)
                        this.__removeElement(item);
                }
            }
        }

        if (ObservableCollectionChangeAction.contains(ObservableCollectionChangeAction.Add, args.action)) {
            let index = args.newIndex;
            for (let item of args.newItems) {
                if (item instanceof VisualTreeElement) {
                    if (item instanceof VisualTreeElement)
                        this.__insertElement(item, index);
                }
                index++;
            }
        }
    }

    get children(): ObservableCollection<VisualTreeElement> { return this.__children; }
    protected __children: ObservableCollection<VisualTreeElement> = new ObservableCollection();

    get attributes(): ObservableCollection<VisualTreeElement> {return this.__attributes; }
    protected __attributes: ObservableCollection<VisualTreeElement> = new ObservableCollection();

    get domElement(): Element | null { return domElements.get(this) || null }

    destructor() {
        //Remove all nodes
        for (let child of this.children)
            child.destruct();
        for (let attribute of this.attributes)
            attribute.destruct();

        this.domElement?.remove();
    }
}

export class VisualTreeAttribute extends Destructible {
}