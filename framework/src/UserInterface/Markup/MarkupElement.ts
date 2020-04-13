import { MarkupNode, $setParent } from "./MarkupNode.js";
import { Enumeration } from "../../Standard/index.js";
import { ObservableCollectionChangeArgs, ObservableCollectionChangeAction, ObservableCollection } from "../../Standard/Collections/index.js";
import { MarkupAttribute } from "./MarkupAttribute.js";
import { MarkupAttributeCollection } from "./MarkupAttributeCollection.js";
import { DependencyProperty, PropertyChangeEventArgs } from "../DependencyObjects/index.js";
import { Type } from "../../Standard/Types/index.js";
import { FrameworkEvent } from "../../Standard/Events/index.js";
import { ChildrenChangeEventArgs, AttributesChangeEventArgs } from "./index.js";
import { ChildrenChangeAction } from "./ChildrenChangeAction.js";
import { AttributesChangeAction } from "./AttributesChangeAction.js";

export class MarkupElement extends MarkupNode {
    constructor(name: string) {
        super(name);

        this.children = new ObservableCollection<MarkupElement>();
        this.attributes = new MarkupAttributeCollection();
    }

    private __children_onChange(_sender: any, args: ObservableCollectionChangeArgs<MarkupElement>) {
        let childrenChangeAction = 0;

        if (Enumeration.contains(ObservableCollectionChangeAction.Remove, args.action)) {
            for (let item of args.oldItems)
                item[$setParent](null);

            childrenChangeAction |= ChildrenChangeAction.Remove;
        }

        if (Enumeration.contains(ObservableCollectionChangeAction.Add, args.action)) {
            for (let item of args.newItems)
                item[$setParent](this);

            childrenChangeAction |= ChildrenChangeAction.Add;
        }

        this.ChildrenChangeEvent.invoke(this, new ChildrenChangeEventArgs(childrenChangeAction, args.oldItems, args.newItems));
    }

    static childrenProperty = DependencyProperty.register(MarkupElement, "children", { valueType: Type.get(ObservableCollection) });
    get children(): ObservableCollection<MarkupElement> { return this.get(MarkupElement.childrenProperty); }
    set children(value: ObservableCollection<MarkupElement>) { this.set(MarkupElement.childrenProperty, value); }

    private __attributes_onChange(args: ObservableCollectionChangeArgs<MarkupAttribute>) {
        let attributesChangeAction = 0;

        if (Enumeration.contains(ObservableCollectionChangeAction.Remove, args.action)) {
            for (let item of args.oldItems)
                item[$setParent](null);

            attributesChangeAction |= AttributesChangeAction.Remove;
        }

        if (Enumeration.contains(ObservableCollectionChangeAction.Add, args.action)) {
            for (let item of args.newItems)
                item[$setParent](this);

            attributesChangeAction |= AttributesChangeAction.Add;
        }

        this.AttributesChangeEvent.invoke(this, new AttributesChangeEventArgs(attributesChangeAction, args.oldItems, args.newItems));
    }

    protected __children_changed() {
        this.children.ChangeEvent.attach(this.__children_onChange, this);
    }

    protected __attributes_changed() {
        this.attributes.ChangeEvent.attach(this.__attributes_onChange, this);
    }

    protected __onPropertyChange(_sender: any, args: PropertyChangeEventArgs) {
        if (args.property === MarkupElement.childrenProperty)
            this.__children_changed();
        else if (args.property === MarkupElement.attributesProperty)
            this.__attributes_changed();
    }

    static attributesProperty = DependencyProperty.register(MarkupElement, "attributes", { valueType: Type.get(MarkupAttributeCollection) });
    get attributes(): MarkupAttributeCollection { return this.get(MarkupElement.attributesProperty); }
    set attributes(value: MarkupAttributeCollection) { this.set(MarkupElement.attributesProperty, value); }

    ChildrenChangeEvent = new FrameworkEvent<ChildrenChangeEventArgs>();
    AttributesChangeEvent = new FrameworkEvent<AttributesChangeEventArgs>();

    protected destructor() {
        //Remove self from parent
        if (this.parent)
            this.parent.children.remove(this);

        super.destructor();
    }
}