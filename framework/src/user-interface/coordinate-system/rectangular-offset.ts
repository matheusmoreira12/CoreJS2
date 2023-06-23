import { assertParams } from "../../validation/index.js";
import { Length, LengthUnit, Orientation } from "./index.js";

export class RectangularOffset {
    static get zero(): RectangularOffset {
        return new RectangularOffset(
            Length.zero,
            Length.zero,
            Length.zero,
            Length.zero
        );
    }

    static getUniform(offset: Length) {
        return new RectangularOffset(
            offset,
            offset,
            offset,
            offset
        );
    }

    static getCentimeters(left: number, top: number, right: number, bottom: number): RectangularOffset { return new RectangularOffset(Length.getCentimeters(left), Length.getCentimeters(top), Length.getCentimeters(right), Length.getCentimeters(bottom)); }

    static getMillimeters(left: number, top: number, right: number, bottom: number): RectangularOffset { return new RectangularOffset(Length.getMillimeters(left), Length.getMillimeters(top), Length.getMillimeters(right), Length.getMillimeters(bottom)); }

    static getInches(left: number, top: number, right: number, bottom: number): RectangularOffset { return new RectangularOffset(Length.getInches(left), Length.getInches(top), Length.getInches(right), Length.getInches(bottom)); }

    static getPixels(left: number, top: number, right: number, bottom: number): RectangularOffset { return new RectangularOffset(Length.getPixels(left), Length.getPixels(top), Length.getPixels(right), Length.getPixels(bottom)); }

    static getPoints(left: number, top: number, right: number, bottom: number): RectangularOffset { return new RectangularOffset(Length.getPoints(left), Length.getPoints(top), Length.getPoints(right), Length.getPoints(bottom)); }

    static getPicas(left: number, top: number, right: number, bottom: number): RectangularOffset { return new RectangularOffset(Length.getPicas(left), Length.getPicas(top), Length.getPicas(right), Length.getPicas(bottom)); }

    static getEm(left: number, top: number, right: number, bottom: number): RectangularOffset { return new RectangularOffset(Length.getEm(left), Length.getEm(top), Length.getEm(right), Length.getEm(bottom)); }

    static getEx(left: number, top: number, right: number, bottom: number): RectangularOffset { return new RectangularOffset(Length.getEx(left), Length.getEx(top), Length.getEx(right), Length.getEx(bottom)); }

    static getCh(left: number, top: number, right: number, bottom: number): RectangularOffset { return new RectangularOffset(Length.getCh(left), Length.getCh(top), Length.getCh(right), Length.getCh(bottom)); }

    static getRem(left: number, top: number, right: number, bottom: number): RectangularOffset { return new RectangularOffset(Length.getRem(left), Length.getRem(top), Length.getRem(right), Length.getRem(bottom)); }

    static getVw(left: number, top: number, right: number, bottom: number): RectangularOffset { return new RectangularOffset(Length.getVw(left), Length.getVw(top), Length.getVw(right), Length.getVw(bottom)); }

    static getVh(left: number, top: number, right: number, bottom: number): RectangularOffset { return new RectangularOffset(Length.getVh(left), Length.getVh(top), Length.getVh(right), Length.getVh(bottom)); }

    static getVmin(left: number, top: number, right: number, bottom: number): RectangularOffset { return new RectangularOffset(Length.getVmin(left), Length.getVmin(top), Length.getVmin(right), Length.getVmin(bottom)); }

    static getVmax(left: number, top: number, right: number, bottom: number): RectangularOffset { return new RectangularOffset(Length.getVmax(left), Length.getVmax(top), Length.getVmax(right), Length.getVmax(bottom)); }

    static getPercent(left: number, top: number, right: number, bottom: number): RectangularOffset { return new RectangularOffset(Length.getPercent(left), Length.getPercent(top), Length.getPercent(right), Length.getPercent(bottom)); }

    constructor(left: Length, top: Length, right: Length, bottom: Length) {
        this.#left = left;
        this.#top = top;
        this.#right = right;
        this.#bottom = bottom;
    }

    toCentimeters(element: Element | null = null): RectangularOffset {
        return this.convert(LengthUnit.Centimeters, element);
    }

    toMillimeters(element: Element | null = null): RectangularOffset {
        return this.convert(LengthUnit.Millimeters, element);
    }

    toInches(element: Element | null = null): RectangularOffset {
        return this.convert(LengthUnit.Inches, element);
    }

    toPixels(element: Element | null = null): RectangularOffset {
        return this.convert(LengthUnit.Pixels, element);
    }

    toPoints(element: Element | null = null): RectangularOffset {
        return this.convert(LengthUnit.Points, element);
    }

    toPicas(element: Element | null = null): RectangularOffset {
        return this.convert(LengthUnit.Picas, element);
    }

    toEm(element: Element | null = null): RectangularOffset {
        return this.convert(LengthUnit.Em, element);
    }

    toEx(element: Element | null = null): RectangularOffset {
        return this.convert(LengthUnit.Ex, element);
    }

    toCh(element: Element | null = null): RectangularOffset {
        return this.convert(LengthUnit.Ch, element);
    }

    toRem(element: Element | null = null): RectangularOffset {
        return this.convert(LengthUnit.Rem, element);
    }

    toVw(element: Element | null = null): RectangularOffset {
        return this.convert(LengthUnit.Vw, element);
    }

    toVh(element: Element | null = null): RectangularOffset {
        return this.convert(LengthUnit.Vh, element);
    }

    toVmin(element: Element | null = null): RectangularOffset {
        return this.convert(LengthUnit.Vmin, element);
    }

    toVmax(element: Element | null = null): RectangularOffset {
        return this.convert(LengthUnit.Vmax, element);
    }

    toPercent(element: Element | null = null): RectangularOffset {
        return this.convert(LengthUnit.Percent, element);
    }

    convert(unit: number, element: Element | null = null): RectangularOffset {
        assertParams({ unit }, [Number]);
        LengthUnit.assertFlag(unit);
        assertParams({ element }, [Element, null]);

        return new RectangularOffset(
            this.left.convert(unit, element, Orientation.Horizontal),
            this.top.convert(unit, element, Orientation.Vertical),
            this.right.convert(unit, element, Orientation.Horizontal),
            this.bottom.convert(unit, element, Orientation.Vertical),
        );
    }

    inflate(thickness: RectangularOffset): RectangularOffset {
        assertParams({ thickness }, [RectangularOffset]);

        return new RectangularOffset(
            this.left.add(thickness.left),
            this.top.add(thickness.top),
            this.right.add(thickness.right),
            this.bottom.add(thickness.bottom)
        )
    }

    invert() {
        return new RectangularOffset(
            this.left.invert(),
            this.top.invert(),
            this.right.invert(),
            this.bottom.invert()
        );
    }

    scale(factor: number): RectangularOffset {
        assertParams({ factor }, [Number]);

        return new RectangularOffset(
            this.left.multiply(factor),
            this.top.multiply(factor),
            this.right.multiply(factor),
            this.bottom.multiply(factor)
        )
    }

    flipHorizontal() {
        return new RectangularOffset(
            this.right,
            this.top,
            this.left,
            this.bottom
        )
    }

    flipVertical() {
        return new RectangularOffset(
            this.left,
            this.bottom,
            this.right,
            this.top
        )
    }

    swapDimensions() {
        return new RectangularOffset(
            this.top,
            this.left,
            this.bottom,
            this.right
        );
    }

    get left(): Length { return this.#left; }
    #left: Length;

    get top(): Length { return this.#top; }
    #top: Length;

    get right(): Length { return this.#right; }
    #right: Length;

    get bottom(): Length { return this.#bottom; }
    #bottom: Length;
}
