import { InvalidOperationException, Destructible } from "../../Standard/index.js";
import { assertParams } from "../../Validation/index.js";
import { VisualTreeElement } from "./VisualTreeElement.js";
import { Blender } from "../../Standard/Blender/Blender.js";
import { DependencyObject } from "../DependencyObjects/DependencyObject.js";
import { FrameworkEvent } from "../../Standard/Events/index.js";
import { PropertyChangeEventArgs, DependencyProperty } from "../DependencyObjects/index.js";
import { IDependencyObject } from "../DependencyObjects/IDependencyObject.js";

//Public keys for VisualTreeNode
export const $setParent = Symbol("setParent");

//Keys for VisualTreeNode
const $namespaceURI = Symbol("domElement");
const $qualifiedName = Symbol("domElement");
const $parent = Symbol("domElement");

export abstract class VisualTreeNode extends Destructible implements IDependencyObject {
    constructor(qualifiedName: string, namespaceURI: string | null = null) {
        super();

        assertParams({ qualifiedName }, [String]);
        assertParams({ namespaceURI }, [String, null]);

        if (new.target === VisualTreeNode)
            throw new InvalidOperationException("Invalid constructor.");

        this[$qualifiedName] = qualifiedName;
        this[$namespaceURI] = namespaceURI;

        Blender.blend(DependencyObject, this);
        Blender.initialize(DependencyObject, this);

        Blender.execute(this, DependencyObject, o => o.PropertyChangeEvent.attach(this.PropertyChangeEvent));
        this.get = Blender.execute(this, DependencyObject, o => o.get.bind(o));
        this.set = Blender.execute(this, DependencyObject, o => o.set.bind(o));
    }

    protected onPropertyChange(_sender: any, _args: PropertyChangeEventArgs) { }

    PropertyChangeEvent: FrameworkEvent<PropertyChangeEventArgs> = new FrameworkEvent(this.onPropertyChange, this);

    [$setParent](parent: VisualTreeElement | null) {
        this[$parent] = parent;
    }

    get parent(): VisualTreeElement | null { return this[$parent]; }
    private [$parent]: VisualTreeElement | null = null;

    get namespaceURI(): string | null { return this[$namespaceURI]; }
    private [$namespaceURI]: string | null;

    get qualifiedName(): string { return this[$qualifiedName]; }
    private [$qualifiedName]: string;

    get: (property: DependencyProperty) => any;

    set: (property: DependencyProperty, value: any) => void;

    protected destructor() {
        Blender.unBlend(DependencyObject, this);
    }
}