import { DependencyObject, DependencyProperty } from "../Standard/DependencyObjects/index.js";
import { Type } from "../Standard/Reflection/Type.js";
import { ResourceDictionary } from "../UserInterface/Resources/index.js";
import { InvalidOperationException } from "../Standard/Exceptions/index.js";

const allApplications: Application[] = [];

export abstract class Application extends DependencyObject {
    constructor() {
        super();

        this.resources = new ResourceDictionary();

        allApplications.push(this);
    }

    protected abstract initializer(): void;

    initialize() {
        if (this.isInitialized)
            throw new InvalidOperationException("Cannot initialize application. Application has already been initialized.");
        else {
            this.initializer();
            this.__isInitialized = true;
        }
    }

    protected abstract finalizer(): void;

    finalize() {
        if (this.isInitialized) {
            this.finalizer();
            this.__isInitialized = false;
        }
        else
            throw new InvalidOperationException("Cannot finalize application. Application has not been initialized.");
    }

    get isInitialized(): boolean { return this.__isInitialized; }
    private __isInitialized: boolean = false;

    protected destructor() {
        if (this.isInitialized)
            this.finalize();

        if (!this.resources.isDestructed)
            this.resources.destruct();
    }

    static resourcesProperty = DependencyProperty.registerAttached(Application, "resources", { valueType: Type.get(ResourceDictionary) });
    get resources(): ResourceDictionary { return this.get(Application.resourcesProperty); }
    set resources(value: ResourceDictionary) { this.set(Application.resourcesProperty, value); }
}

function window_onload() {
    window.removeEventListener("load", window_onload);

    for (let application of allApplications) {
        if (!application.isInitialized)
            application.initialize();
    }
}

window.addEventListener("load", window_onload);