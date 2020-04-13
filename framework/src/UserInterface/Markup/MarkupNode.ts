import { InvalidOperationException, Destructible } from "../../Standard/index.js";
import { assertParams } from "../../Validation/index.js";
import { MarkupElement } from "./MarkupElement.js";
import { Blender } from "../../Standard/Blender/Blender.js";
import { DependencyObject } from "../DependencyObjects/DependencyObject.js";
import { FrameworkEvent } from "../../Standard/Events/index.js";
import { PropertyChangeEventArgs, DependencyProperty } from "../DependencyObjects/index.js";
import { IDependencyObject } from "../DependencyObjects/IDependencyObject.js";

//Public keys for VisualTreeNode
export const $setParent = Symbol("setParent");

//Keys for VisualTreeNode
const $name = Symbol("domElement");
const $parent = Symbol("domElement");

export abstract class MarkupNode extends Destructible implements IDependencyObject {
    constructor(name: string) {
        super();

        assertParams({ name: name }, [String]);

        if (new.target === MarkupNode)
            throw new InvalidOperationException("Invalid constructor.");

        this[$name] = name;

        Blender.blend(DependencyObject, this);
        Blender.initialize(DependencyObject, this);

        Blender.get(DependencyObject, this).PropertyChangeEvent.attach(this.PropertyChangeEvent);
        this.get = Blender.execute(this, DependencyObject, o => o.get.bind(o));
        this.set = Blender.execute(this, DependencyObject, o => o.set.bind(o));
    }

    protected __onPropertyChange(_sender: any, _args: PropertyChangeEventArgs) { }

    PropertyChangeEvent: FrameworkEvent<PropertyChangeEventArgs> = new FrameworkEvent(this.__onPropertyChange, this);

    [$setParent](parent: MarkupElement | null) {
        this[$parent] = parent;
    }

    get parent(): MarkupElement | null { return this[$parent]; }
    private [$parent]: MarkupElement | null = null;

    get name(): string { return this[$name]; }
    private [$name]: string;

    get: (property: DependencyProperty) => any;

    set: (property: DependencyProperty, value: any) => void;

    protected destructor() {
        Blender.deBlend(DependencyObject, this);
    }
}