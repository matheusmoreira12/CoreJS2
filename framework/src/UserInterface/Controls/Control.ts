import { DependencyObject, DependencyProperty } from "../../Standard/DependencyObjects/index.js";
import { Size, Length } from "../Coordinates/index.js";
import { Type } from "../../Standard/Types/index.js";
import { InvalidOperationException } from "../../Standard/Exceptions/index.js";
import { ControlStyle } from "./Styling/index.js";

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

    static isInitializedProperty = DependencyProperty.registerReadonly(Control, "isInitialized", { valueType: Type.get(Boolean), defaultValue: false });
    get isInitialized(): boolean { return this.get(Control.isInitializedProperty); }

    static domElementProperty = DependencyProperty.registerReadonly(Control, "domElement", { defaultValue: null });
    get domElement(): Element | null { return this.get(Control.domElementProperty); }

    static widthProperty = DependencyProperty.registerAttached(Control, "width", { valueType: Type.get(Length) });
    get width(): Length { return this.get(Control.widthProperty); }
    set width(value: Length) { this.set(Control.widthProperty, value); }

    static heightProperty = DependencyProperty.registerAttached(Control, "height", { valueType: Type.get(Length) });
    get height(): Length { return this.get(Control.heightProperty); }
    set height(value: Length) { this.set(Control.heightProperty, value); }

    static actualWidthProperty = DependencyProperty.registerAttached(Control, "actualWidth", { valueType: Type.get(Length) });
    get actualWidth(): Length { return this.get(Control.actualWidthProperty); }
    set actualWidth(value: Length) { this.set(Control.actualWidthProperty, value); }

    static actualHeightProperty = DependencyProperty.registerAttached(Control, "actualHeight", { valueType: Type.get(Length) });
    get actualHeight(): Length { return this.get(Control.actualHeightProperty); }
    set actualHeight(value: Length) { this.set(Control.actualHeightProperty, value); }

    get style(): ControlStyle { return this.__style; }
    private __style: ControlStyle = new ControlStyle(this);
}