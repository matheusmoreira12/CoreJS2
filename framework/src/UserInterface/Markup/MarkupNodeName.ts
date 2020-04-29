import { Destructible } from "../../Standard/index.js";
import { InvalidOperationException } from "../../Standard/Exceptions/index.js"
import { assertParams } from "../../Validation/index.js";
import { MarkupElement } from "./MarkupElement.js";
import { Blender } from "../../Standard/Blender/Blender.js";
import { DependencyObject } from "../DependencyObjects/DependencyObject.js";
import { FrameworkEvent } from "../../Standard/Events/index.js";
import { PropertyChangeEventArgs, DependencyProperty } from "../DependencyObjects/index.js";
import { IDependencyObject } from "../DependencyObjects/IDependencyObject.js";
import { NodeName } from "./NodeName.js";

export abstract class MarkupNodeName extends Destructible implements IDependencyObject {
    constructor(name: string) {
        super();

        assertParams({ name: name }, [String]);

        if (new.target === MarkupNodeName)
            throw new InvalidOperationException("Invalid constructor.");

        this.__name = new NodeName(name);

        Blender.blend(DependencyObject, this);
        Blender.initialize(DependencyObject, this);
        Blender.get(DependencyObject, this).PropertyChangeEvent.attach(this.PropertyChangeEvent);
        this.get = Blender.execute(this, DependencyObject, o => o.get.bind(o));
        this.set = Blender.execute(this, DependencyObject, o => o.set.bind(o));
    }

    protected __onPropertyChange(_sender: any, _args: PropertyChangeEventArgs) { }

    PropertyChangeEvent: FrameworkEvent<PropertyChangeEventArgs> = new FrameworkEvent(this.__onPropertyChange, this);

    get parent(): MarkupElement | null { return this.__parent; }
    __parent: MarkupElement | null = null;

    get name(): NodeName { return this.__name; }
    private __name: NodeName;

    get: (property: DependencyProperty) => any;

    set: (property: DependencyProperty, value: any) => void;

    protected destructor() {
        Blender.deBlend(DependencyObject, this);
    }
}