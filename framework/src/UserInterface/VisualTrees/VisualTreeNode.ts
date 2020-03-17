import { InvalidOperationException, Destructible } from "../../Standard/index";
import { assertParams } from "../../Validation/index";
import { VisualTreeElement, $set_parent } from "./VisualTreeElement";
import { Blender } from "../../Standard/Blender/Blender";
import { DependencyObject } from "../DependencyObjects/DependencyObject";
import { FrameworkEvent } from "../../Standard/Events/index";
import { PropertyChangeEventArgs } from "../DependencyObjects/index";

export abstract class VisualTreeNode extends Destructible {
    constructor(qualifiedName: string, namespaceURI: string | null = null) {
        super();

        assertParams({ qualifiedName }, [String]);
        assertParams({ namespaceURI }, [String, null]);

        if (new.target === VisualTreeNode)
            throw new InvalidOperationException("Invalid constructor.");

        this.__qualifiedName = qualifiedName;
        this.__namespaceURI = namespaceURI;

        Blender.blend(DependencyObject, this);
        Blender.initialize(DependencyObject, this);

        Blender.execute(this, DependencyObject, o => o.PropertyChangeEvent.attach(this.PropertyChangeEvent));
    }

    protected onPropertyChange(sender: any, args: PropertyChangeEventArgs) {
    }

    private PropertyChangeEvent: FrameworkEvent<PropertyChangeEventArgs> = new FrameworkEvent(this.onPropertyChange);

    [$set_parent](parent: VisualTreeElement) {
        this.__parent = parent;
    }

    [$set_parent]() {
        this.__parent = null;
    }

    get parent(): VisualTreeElement | null { return this.__parent; }
    __parent: VisualTreeElement | null = null;

    get namespaceURI(): string | null { return this.__namespaceURI; }
    private __namespaceURI: string;

    get qualifiedName(): string { return this.__qualifiedName; }
    private __qualifiedName: string;

    destructor() {
        Blender.deBlend(DependencyObject, this);
    }
}