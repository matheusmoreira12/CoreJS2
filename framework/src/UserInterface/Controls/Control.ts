import { DependencyObject, DependencyProperty } from "../DependencyObjects/index.js";
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