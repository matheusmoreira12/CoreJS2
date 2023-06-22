import { assertParams } from "../../validation/index.js";
import { Length, LengthUnit, Orientation } from "./index.js";

export class RectangularOffset {
    static get zero(): RectangularOffset {
        return new RectangularOffset(Length.zero, Length.zero, Length.zero, Length.zero);
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

    toCentimeters(): RectangularOffset {
        return new RectangularOffset(
            this.left.toCentimeters(),
            this.top.toCentimeters(),
            this.right.toCentimeters(),
            this.bottom.toCentimeters(),
        );
    }

    toMillimeters(): RectangularOffset {
        return new RectangularOffset(
            this.left.toMillimeters(),
            this.top.toMillimeters(),
            this.right.toMillimeters(),
            this.bottom.toMillimeters(),
        );
    }

    toInches(): RectangularOffset {
        return new RectangularOffset(
            this.left.toInches(),
            this.top.toInches(),
            this.right.toInches(),
            this.bottom.toInches(),
        );
    }

    toPixels(): RectangularOffset {
        return new RectangularOffset(
            this.left.toPixels(),
            this.top.toPixels(),
            this.right.toPixels(),
            this.bottom.toPixels(),
        );
    }

    toPoints(): RectangularOffset {
        return new RectangularOffset(
            this.left.toPoints(),
            this.top.toPoints(),
            this.right.toPoints(),
            this.bottom.toPoints(),
        );
    }

    toPicas(): RectangularOffset {
        return new RectangularOffset(
            this.left.toPicas(),
            this.top.toPicas(),
            this.right.toPicas(),
            this.bottom.toPicas(),
        );
    }

    toEm(element: Element): RectangularOffset {
        assertParams({ element }, [Element]);

        return new RectangularOffset(
            this.left.toEm(element),
            this.top.toEm(element),
            this.right.toEm(element),
            this.bottom.toEm(element),
        );
    }

    toEx(element: Element): RectangularOffset {
        assertParams({ element }, [Element]);

        return new RectangularOffset(
            this.left.toEx(element),
            this.top.toEx(element),
            this.right.toEx(element),
            this.bottom.toEx(element),
        );
    }

    toCh(element: Element): RectangularOffset {
        assertParams({ element }, [Element]);

        return new RectangularOffset(
            this.left.toCh(element),
            this.top.toCh(element),
            this.right.toCh(element),
            this.bottom.toCh(element),
        );
    }

    toRem(): RectangularOffset {
        return new RectangularOffset(
            this.left.toRem(),
            this.top.toRem(),
            this.right.toRem(),
            this.bottom.toRem(),
        );
    }

    toVw(): RectangularOffset {
        return new RectangularOffset(
            this.left.toVw(),
            this.top.toVw(),
            this.right.toVw(),
            this.bottom.toVw(),
        );
    }

    toVh(): RectangularOffset {
        return new RectangularOffset(
            this.left.toVh(),
            this.top.toVh(),
            this.right.toVh(),
            this.bottom.toVh(),
        );
    }

    toVmin(): RectangularOffset {
        return new RectangularOffset(
            this.left.toVmin(),
            this.top.toVmin(),
            this.right.toVmin(),
            this.bottom.toVmin(),
        );
    }

    toVmax(): RectangularOffset {
        return new RectangularOffset(
            this.left.toVmax(),
            this.top.toVmax(),
            this.right.toVmax(),
            this.bottom.toVmax(),
        );
    }

    toPercent(element: Element, orientation: number): RectangularOffset {
        assertParams({ element }, [Element]);
        Orientation.assertFlag(orientation);

        return new RectangularOffset(
            this.left.toPercent(element, Orientation.Horizontal),
            this.top.toPercent(element, Orientation.Vertical),
            this.right.toPercent(element, Orientation.Horizontal),
            this.bottom.toPercent(element, Orientation.Vertical),
        );

    }

    convertImplicitly(unit: number): RectangularOffset {
        assertParams({ unit }, [Number]);
        LengthUnit.assertFlag(unit);

        return new RectangularOffset(
            this.left.convertImplicitly(unit),
            this.top.convertImplicitly(unit),
            this.right.convertImplicitly(unit),
            this.bottom.convertImplicitly(unit),
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
