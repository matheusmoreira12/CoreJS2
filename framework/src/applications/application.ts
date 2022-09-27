import { DependencyObject, DependencyProperty, PropertyMetadata } from "../standard/dependency-objects/index.js";
import { Type } from "../standard/reflection/type.js";
import { ResourceDictionary } from "../user-interface/resources/index.js";
import { InvalidOperationException } from "../standard/exceptions/index.js";

const allApplications: Application[] = [];

export abstract class Application extends DependencyObject {
    static getAll(): Application[] {
        return [...allApplications];
    }

    constructor() {
        super();

        if (new.target === Application)
            throw new InvalidOperationException("Invalid constructor.");

        this.set(Application.__resourcesPropertyKey, new ResourceDictionary());

        allApplications.push(this);

        ApplicationInitializer.checkDocumentReadyStateAndInitializeApplication(this);
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

    static __resourcesPropertyKey = DependencyProperty.registerReadonly(Type.get(Application), "resources", new PropertyMetadata(Type.get(ResourceDictionary)));
    static resourcesProperty = Application.__resourcesPropertyKey.property;
    get resources(): ResourceDictionary { return this.get(Application.resourcesProperty); }
}

namespace ApplicationInitializer {
    let canInitializeApplications = false;

    function updateCanInitializeApplications() {
        canInitializeApplications = document.readyState == "interactive" || document.readyState == "complete";
    }

    export function checkDocumentReadyStateAndInitializeApplication(application: Application) {
        if (canInitializeApplications && !application.isInitialized)
            application.initialize();
    }

    function checkDocumentReadyStateAndInitializeAllApplications() {
        for (let application of allApplications) {
            if (!application.isInitialized)
                checkDocumentReadyStateAndInitializeApplication(application);
        }
    }

    function document_onreadystatechange() {
        updateCanInitializeApplications();
        checkDocumentReadyStateAndInitializeAllApplications();
    }

    document.addEventListener("readystatechange", document_onreadystatechange);
}