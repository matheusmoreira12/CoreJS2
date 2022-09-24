import { DependencyObject } from "../../standard/dependency-objects/index.js";
import { InvalidOperationException } from "../../standard/exceptions/index.js";

import * as __Registry from "./__registry.js";
import * as __Activator from "./__activator.js";
import { ControlConstructor } from "./control-constructor";

export abstract class Control extends DependencyObject {
    static register(control: ControlConstructor, elementName: string, elementNamespaceURI: string) {
        __Registry.tryRegister(control, elementName, elementNamespaceURI);
    }

    constructor() {
        super();

        if (new.target === Control)
            throw new InvalidOperationException("Invalid constructor.");

        if (!__Activator.tryBeginControlInstanceLifecycle(this))
            throw new InvalidOperationException("Cannot begin control instance lifecycle.");
    }

    protected destructor(): void {
        super.destructor();

        if (!__Activator.tryEndControlInstanceLifecycle(this))
            throw new InvalidOperationException("Cannot end control instance lifecycle.");
    }

    initialize(domElement: Element) { }

    finalize() { }
}