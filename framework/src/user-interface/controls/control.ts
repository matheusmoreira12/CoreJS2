import { DependencyObject, DependencyProperty, PropertyMetadata } from "../../standard/dependency-objects/index.js";
import { Size, Length } from "../coordinates/index.js";
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

    protected abstract __calculateSize(): Size;

    protected __updateSize(calculatedSize: Size) {
        this.actualWidth = calculatedSize.width;
        this.actualHeight = calculatedSize.height;
    }

    invalidateSize() {
        const calculatedSize = this.__calculateSize();
        this.__updateSize(calculatedSize);
    }

    protected abstract __updateVisual(): void;

    invalidateVisual() {

    }

    //Lifecycle Management
    protected abstract __initializer(): void;

    protected abstract __finalizer(): void;

    initialize(domElement: Element) {
        if (this.isInitialized)
            throw new InvalidOperationException("Cannot initialize control. Control has already been initialized.");
        else {
            this.set(Control.domElementProperty, domElement);
            this.__initializer();
            this.set(Control.isInitializedProperty, true);
        }
    }

    finalize() {
        if (this.isInitialized) {
            this.__finalizer();
            this.set(Control.domElementProperty, null);
            this.set(Control.isInitializedProperty, false);
        }
        else
            throw new InvalidOperationException("Cannot finalize control. Control has not been initialized.");
    }

    static isInitializedProperty = DependencyProperty.registerAttachedReadonly(Control, "isInitialized", new PropertyMetadata(Type.get(Boolean), false ));
    get isInitialized(): boolean { return this.get(Control.isInitializedProperty); }

    static domElementProperty = DependencyProperty.registerAttachedReadonly(Control, "domElement", new PropertyMetadata(new OrConstraint([Type.get(Element), Type.of(null)]), null));
    get domElement(): Element | null { return this.get(Control.domElementProperty); }

    static widthProperty = DependencyProperty.registerAttached(Control, "width", new PropertyMetadata(Type.get(Length)));
    get width(): Length { return this.get(Control.widthProperty); }
    set width(value: Length) { this.set(Control.widthProperty, value); }

    static heightProperty = DependencyProperty.registerAttached(Control, "height", new PropertyMetadata(Type.get(Length)));
    get height(): Length { return this.get(Control.heightProperty); }
    set height(value: Length) { this.set(Control.heightProperty, value); }

    static actualWidthProperty = DependencyProperty.registerAttached(Control, "actualWidth", new PropertyMetadata(Type.get(Length)));
    get actualWidth(): Length { return this.get(Control.actualWidthProperty); }
    set actualWidth(value: Length) { this.set(Control.actualWidthProperty, value); }

    static actualHeightProperty = DependencyProperty.registerAttached(Control, "actualHeight", new PropertyMetadata(Type.get(Length)));
    get actualHeight(): Length { return this.get(Control.actualHeightProperty); }
    set actualHeight(value: Length) { this.set(Control.actualHeightProperty, value); }

    get style(): ControlStyle { return this.__style; }
    private __style: ControlStyle = new ControlStyle(this);
}