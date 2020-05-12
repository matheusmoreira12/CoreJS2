import { DependencyObject, DependencyProperty } from "../UserInterface/DependencyObjects/index.js";
import { Type } from "../Standard/Types/Type.js";
import { ResourceDictionary } from "../UserInterface/Resources/index.js";
import { InvalidOperationException } from "../Standard/Exceptions/index.js";

export abstract class Application extends DependencyObject {
    constructor() {
        super();

        this.resources = new ResourceDictionary();
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
        if (this.isInitialized)
        {
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
    }

    static resourcesProperty = DependencyProperty.register(Application, "resources", { valueType: Type.get(ResourceDictionary) });
    get resources(): ResourceDictionary { return this.get(Application.resourcesProperty); }
    set resources(value: ResourceDictionary) { this.set(Application.resourcesProperty, value); }
}
