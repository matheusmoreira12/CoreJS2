import { InvalidOperationException, Destructible } from "../../Standard/index";
import { assertParams } from "../../Validation/index";
import { VisualTreeElement } from "./VisualTreeElement";
import { Blender } from "../../Standard/Blender/Blender";
import { DependencyObject } from "../DependencyObjects/DependencyObject";
import { FrameworkEvent } from "../../Standard/Events/index";
import { PropertyChangeEventArgs } from "../DependencyObjects/index";

//Public keys for VisualTreeNode
export const $setParent = Symbol("setParent");
export const $unsetParent = Symbol("unsetParent");

//Keys for VisualTreeNode
const $namespaceURI = Symbol("domElement");
const $qualifiedName = Symbol("domElement");
const $parent = Symbol("domElement");

export abstract class VisualTreeNode extends Destructible {
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
    }

    protected onPropertyChange(sender: any, args: PropertyChangeEventArgs) {
    }

    private PropertyChangeEvent: FrameworkEvent<PropertyChangeEventArgs> = new FrameworkEvent(this.onPropertyChange, this);

    [$setParent](parent: VisualTreeElement) {
        this[$parent] = parent;
    }

    [$unsetParent]() {
        this[$parent] = null;
    }

    get parent(): VisualTreeElement | null { return this[$parent]; }
    [$parent]: VisualTreeElement | null = null;

    get namespaceURI(): string | null { return this[$namespaceURI]; }
    private [$namespaceURI]: string | null;

    get qualifiedName(): string { return this[$qualifiedName]; }
    private [$qualifiedName]: string;

    protected destructor() {
        Blender.deBlend(DependencyObject, this);
    }
}