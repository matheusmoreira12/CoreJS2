import { DependencyObject, DependencyProperty, DependencyPropertyKey, PropertyMetadata } from "../../standard/dependency-objects/index.js";
import { Type } from "../../standard/reflection/index.js";
import { InvalidOperationException } from "../../standard/exceptions/index.js";
import { ControlStyle } from "./styling/index.js";
import { OrConstraint } from "../../standard/reflection/type-constraints/or-constraint.js";

export abstract class Control extends DependencyObject {
    constructor() {
        super();

        if (new.target === Control)
            throw new InvalidOperationException("Invalid constructor.");
    }

    protected abstract __initializer(): void;

    protected abstract __finalizer(): void;

    initialize(domElement: Element) {
        if (this.isInitialized)
            throw new InvalidOperationException("Cannot initialize control. Control has already been initialized.");
        else {
            this.set(Control.__domElementPropertyKey, domElement);
            this.__initializer();
            this.set(Control.__isInitializedPropertyKey, true);
        }
    }

    finalize() {
        if (this.isInitialized) {
            this.__finalizer();
            this.set(Control.__domElementPropertyKey, null);
            this.set(Control.__isInitializedPropertyKey, false);
        }
        else
            throw new InvalidOperationException("Cannot finalize control. Control has not been initialized.");
    }

    static __isInitializedPropertyKey: DependencyPropertyKey = DependencyProperty.registerReadonly(Type.get(Control), "isInitialized", new PropertyMetadata(Type.get(Boolean), false ));
    static isInitializedProperty: DependencyProperty = Control.__isInitializedPropertyKey.property;
    get isInitialized(): boolean { return this.get(Control.isInitializedProperty); }

    static __domElementPropertyKey: DependencyPropertyKey = DependencyProperty.registerReadonly(Type.get(Control), "domElement", new PropertyMetadata(new OrConstraint([Type.get(Element), Type.of(null)]), null));
    static domElementProperty: DependencyProperty = Control.__domElementPropertyKey.property;
    get domElement(): Element | null { return this.get(Control.domElementProperty); }

    static __uniqueIdPropertyKey: DependencyPropertyKey = DependencyProperty.registerReadonly(Type.get(Control), "uniqueId", new PropertyMetadata(Type.get(String)));
    static uniqueIdProperty: DependencyProperty = Control.__uniqueIdPropertyKey.property;
    get uniqueId(): string { return this.get(Control.uniqueIdProperty); }

    static __stylePropertyKey: DependencyPropertyKey = DependencyProperty.registerReadonly(Type.get(Control), "style", new PropertyMetadata(Type.get(ControlStyle)));
    static styleProperty: DependencyProperty = Control.__stylePropertyKey.property;
    get style(): ControlStyle { return this.get(Control.styleProperty); }
}