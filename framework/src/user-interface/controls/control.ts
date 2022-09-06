import { DependencyObject, DependencyProperty, DependencyPropertyKey, PropertyMetadata } from "../../standard/dependency-objects/index.js";
import { Type } from "../../standard/reflection/index.js";
import { InvalidOperationException } from "../../standard/exceptions/index.js";
import { ControlStyle } from "./styling/index.js";
import { OrConstraint } from "../../standard/reflection/type-constraints/or-constraint.js";

import * as __Registry from "./__registry.js";
import * as __Activator from "./__activator.js";

export abstract class Control extends DependencyObject {
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