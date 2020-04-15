import { InvalidOperationException, Destructible } from "../../Standard/index.js";
import { assertParams } from "../../Validation/index.js";
import { MarkupElement } from "./MarkupElement.js";
import { Blender } from "../../Standard/Blender/Blender.js";
import { DependencyObject } from "../DependencyObjects/DependencyObject.js";
import { FrameworkEvent } from "../../Standard/Events/index.js";
import { PropertyChangeEventArgs, DependencyProperty } from "../DependencyObjects/index.js";
import { IDependencyObject } from "../DependencyObjects/IDependencyObject.js";

export abstract class MarkupNode extends Destructible implements IDependencyObject {
    constructor(name: string) {
        super();

        assertParams({ name: name }, [String]);

        if (new.target === MarkupNode)
            throw new InvalidOperationException("Invalid constructor.");

        this.__name = name;

        Blender.blend(DependencyObject, this);
        Blender.initialize(DependencyObject, this);

        Blender.get(DependencyObject, this).PropertyChangeEvent.attach(this.PropertyChangeEvent);
        this.get = Blender.execute(this, DependencyObject, o => o.get.bind(o));
        this.set = Blender.execute(this, DependencyObject, o => o.set.bind(o));
    }

    protected __onPropertyChange(_sender: any, _args: PropertyChangeEventArgs) { }

    PropertyChangeEvent: FrameworkEvent<PropertyChangeEventArgs> = new FrameworkEvent(this.__onPropertyChange, this);

    get parent(): MarkupElement | null { return this.__parent; }
    protected __parent: MarkupElement | null = null;

    get name(): string { return this.__name; }
    private __name: string;

    get: (property: DependencyProperty) => any;

    set: (property: DependencyProperty, value: any) => void;

    protected destructor() {
        Blender.deBlend(DependencyObject, this);
    }
}