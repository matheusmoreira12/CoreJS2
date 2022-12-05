import { DependencyObject, DependencyProperty, PropertyMetadata } from "../../standard/dependency-objects/index.js";
import { InvalidOperationException } from "../../standard/exceptions/index.js";

import * as __Registry from "./__registry.js";
import * as __Activator from "./__activator.js";
import { Type } from "../../standard/reflection/index.js";
import { ObservableCollection, ObservableCollectionChangeAction, ObservableCollectionChangeArgs } from "../../standard/collections/index.js";
import { OutputArgument } from "../../standard/reflection/types.js";
import { ControlConstructor } from "./control-constructor.js";
import { DOMUtils } from "../index.js";
import { ControlChildrenCollection } from "./index.js";

export abstract class Control extends DependencyObject {
    static register(control: ControlConstructor, elementName: string, elementNamespaceURI: string) {
        if (__Registry.tryRegister(control, elementName, elementNamespaceURI))
            return;
        throw new InvalidOperationException("Cannot register control. Control might already be registered.");
    }

    constructor() {
        super();
        if (new.target === Control)
            throw new InvalidOperationException("Invalid constructor.");
        if (!__Activator.tryBeginControlInstanceLifecycle(this))
            throw new InvalidOperationException("Cannot begin control instance lifecycle.");
        this.set(Control.__childrenPropertyKey, new ObservableCollection());
        this.children.ChangeEvent.attach(this.__children_onChange, this);
    }

    private __children_onChange(_sender: ObservableCollection<Control>, args: ObservableCollectionChangeArgs<Control>) {
        switch (args.action) {
            case ObservableCollectionChangeAction.Add:
                DOMUtils.insertElementsAt(this.domElement, args.newIndex, args.newItems.map(c => c.domElement));
                break;
            case ObservableCollectionChangeAction.Remove:
                DOMUtils.removeMany(this.domElement, args.oldItems.map(c => c.domElement));
                break;
        }
    }

    protected destructor(): void {
        super.destructor();

        if (!__Activator.tryEndControlInstanceLifecycle(this))
            throw new InvalidOperationException("Cannot end control instance lifecycle.");
    }

    initialize() { }

    finalize() { }

    get domElement(): Element {
        if (this.__domElement)
            return this.__domElement;

        const tryGetControlInstanceDOMElementOutput: OutputArgument<Element> = {};
        if (!__Activator.tryGetControlInstanceDOMElement(this, tryGetControlInstanceDOMElementOutput))
            throw new InvalidOperationException("Cannot get control instance DOM element.");
        return this.__domElement = tryGetControlInstanceDOMElementOutput.value!;
    }

    private __domElement?: Element;

    get children(): ControlChildrenCollection { return this.get(Control.childrenProperty); }
    private static __childrenPropertyKey = DependencyProperty.registerReadonly(Type.get(Control), "children", new PropertyMetadata(Type.get(ControlChildrenCollection)));
    static childrenProperty = Control.__childrenPropertyKey.property;
}