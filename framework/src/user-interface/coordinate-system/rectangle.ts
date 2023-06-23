import { ArrayUtils, StringUtils } from "../../core-base/utils/index.js";
import { ArgumentException } from "../../standard/exceptions/index.js";
import { assertParams } from "../../validation/index.js";
import { Length, LengthUnit, Orientation, Point, Size, RectangularOffset } from "./index.js";

export class Rectangle {
    static get zero(): Rectangle {
        return new Rectangle(
            Length.zero,
            Length.zero,
            Length.zero,
            Length.zero
        );
    }

    static getCentimeters(left: number, top: number, width: number, height: number): Rectangle {
        return new Rectangle(
            Length.getCentimeters(left),
            Length.getCentimeters(top),
            Length.getCentimeters(width),
            Length.getCentimeters(height)
        );
    }

    static getMillimeters(left: number, top: number, width: number, height: number): Rectangle {
        return new Rectangle(
            Length.getMillimeters(left),
            Length.getMillimeters(top),
            Length.getMillimeters(width),
            Length.getMillimeters(height)
        );
    }

    static getInches(left: number, top: number, width: number, height: number): Rectangle {
        return new Rectangle(
            Length.getInches(left),
            Length.getInches(top),
            Length.getInches(width),
            Length.getInches(height)
        );
    }

    static getPixels(left: number, top: number, width: number, height: number): Rectangle {
        return new Rectangle(
            Length.getPixels(left),
            Length.getPixels(top),
            Length.getPixels(width),
            Length.getPixels(height)
        );
    }

    static getPoints(left: number, top: number, width: number, height: number): Rectangle {
        return new Rectangle(
            Length.getPoints(left),
            Length.getPoints(top),
            Length.getPoints(width),
            Length.getPoints(height)
        );
    }

    static getPicas(left: number, top: number, width: number, height: number): Rectangle {
        return new Rectangle(
            Length.getPicas(left),
            Length.getPicas(top),
            Length.getPicas(width),
            Length.getPicas(height)
        );
    }

    static getEm(left: number, top: number, width: number, height: number): Rectangle {
        return new Rectangle(
            Length.getEm(left),
            Length.getEm(top),
            Length.getEm(width),
            Length.getEm(height)
        );
    }

    static getEx(left: number, top: number, width: number, height: number): Rectangle {
        return new Rectangle(
            Length.getEx(left),
            Length.getEx(top),
            Length.getEx(width),
            Length.getEx(height)
        );
    }

    static getCh(left: number, top: number, width: number, height: number): Rectangle {
        return new Rectangle(
            Length.getCh(left),
            Length.getCh(top),
            Length.getCh(width),
            Length.getCh(height)
        );
    }

    static getRem(left: number, top: number, width: number, height: number): Rectangle {
        return new Rectangle(
            Length.getRem(left),
            Length.getRem(top),
            Length.getRem(width),
            Length.getRem(height)
        );
    }

    static getVw(left: number, top: number, width: number, height: number): Rectangle {
        return new Rectangle(
            Length.getVw(left),
            Length.getVw(top),
            Length.getVw(width),
            Length.getVw(height)
        );
    }

    static getVh(left: number, top: number, width: number, height: number): Rectangle {
        return new Rectangle(
            Length.getVh(left),
            Length.getVh(top),
            Length.getVh(width),
            Length.getVh(height)
        );
    }

    static getVmin(left: number, top: number, width: number, height: number): Rectangle {
        return new Rectangle(
            Length.getVmin(left),
            Length.getVmin(top),
            Length.getVmin(width),
            Length.getVmin(height)
        );
    }

    static getVmax(left: number, top: number, width: number, height: number): Rectangle {
        return new Rectangle(
            Length.getVmax(left),
            Length.getVmax(top),
            Length.getVmax(width),
            Length.getVmax(height)
        );
    }

    static getPercent(left: number, top: number, width: number, height: number): Rectangle {
        return new Rectangle(
            Length.getPercent(left),
            Length.getPercent(top),
            Length.getPercent(width),
            Length.getPercent(height)
        );
    }

    constructor(left: Length, top: Length, width: Length, height: Length) {
        assertParams({ left, top, width, height }, [Length]);

        if (width.amount < 0)
            throw new ArgumentException(StringUtils.nameOf({ width }), "Width cannot be less than zero.");
        if (height.amount < 0)
            throw new ArgumentException(StringUtils.nameOf({ height }), "Height cannot be less than zero.");

        this.#left = left;
        this.#top = top;
        this.#width = width;
        this.#height = height;
    }

    toCentimeters(element: Element | null = null): Rectangle {
        return this.convert(LengthUnit.Centimeters, element);
    }

    toMillimeters(element: Element | null = null): Rectangle {
        return this.convert(LengthUnit.Millimeters, element);
    }

    toInches(element: Element | null = null): Rectangle {
        return this.convert(LengthUnit.Inches, element);
    }

    toPixels(element: Element | null = null): Rectangle {
        return this.convert(LengthUnit.Pixels, element);
    }

    toPoints(element: Element | null = null): Rectangle {
        return this.convert(LengthUnit.Points, element);
    }

    toPicas(element: Element | null = null): Rectangle {
        return this.convert(LengthUnit.Picas, element);
    }

    toEm(element: Element | null = null): Rectangle {
        return this.convert(LengthUnit.Em, element);
    }

    toEx(element: Element | null = null): Rectangle {
        return this.convert(LengthUnit.Ex, element);
    }

    toCh(element: Element | null = null): Rectangle {
        return this.convert(LengthUnit.Ch, element);
    }

    toRem(element: Element | null = null): Rectangle {
        return this.convert(LengthUnit.Rem, element);
    }

    toVw(element: Element | null = null): Rectangle {
        return this.convert(LengthUnit.Vw, element);
    }

    toVh(element: Element | null = null): Rectangle {
        return this.convert(LengthUnit.Vh, element);
    }

    toVmin(element: Element | null = null): Rectangle {
        return this.convert(LengthUnit.Vmin, element);
    }

    toVmax(element: Element | null = null): Rectangle {
        return this.convert(LengthUnit.Vmax, element);
    }

    toPercent(element: Element | null = null): Rectangle {
        return this.convert(LengthUnit.Percent, element);
    }

    convert(unit: number, element: Element | null = null): Rectangle {
        assertParams({ unit }, [Number]);
        LengthUnit.assertFlag(unit);
        assertParams({ element }, [Element, null]);

        return new Rectangle(
            this.left.convert(unit, element, Orientation.Horizontal),
            this.top.convert(unit, element, Orientation.Vertical),
            this.width.convert(unit, element, Orientation.Horizontal),
            this.height.convert(unit, element, Orientation.Vertical)
        );
    }

    translate(offsetX: Length, offsetY: Length): Rectangle {
        assertParams({ offsetX, offsetY }, [Length]);

        return new Rectangle(this.left.add(offsetX), this.top.add(offsetY), this.width, this.height);
    }

    inflate(thickness: RectangularOffset): Rectangle {
        assertParams({ thickness }, [RectangularOffset]);

        return new Rectangle(
            this.left.subtract(thickness.left),
            this.top.subtract(thickness.top),
            this.width.add(thickness.left).add(thickness.right),
            this.height.add(thickness.top).add(thickness.bottom)
        )
    }

    includes(point: Point) {
        return point.x.greaterThanOrEquals(this.left) &&
            point.x.lessThanOrEquals(this.right) &&
            point.y.greaterThanOrEquals(this.top) &&
            point.y.lessThanOrEquals(this.bottom);
    }

    intersectsWith(rectangle: Rectangle): boolean {
        assertParams({ rectangle }, [Rectangle])

        return ArrayUtils.any(rectangle.corners, corner => this.includes(corner));
    }

    intersect(rectangle: Rectangle) {
        if (!this.intersectsWith(rectangle))
            return false;

        const left = Length.max(rectangle.left, this.left);
        const right = Length.min(rectangle.right, this.right);
        const top = Length.max(rectangle.top, this.top);
        const bottom = Length.min(rectangle.bottom, this.bottom);

        return new Rectangle(
            left,
            top,
            right.subtract(left),
            bottom.subtract(top)
        );
    }

    scale(factor: number): Rectangle {
        assertParams({ factor }, [Number]);

        return new Rectangle(
            this.left.multiply(factor),
            this.top.multiply(factor),
            this.width.multiply(factor),
            this.height.multiply(factor)
        );
    }

    invert() {
        return new Rectangle(
            this.left.invert().subtract(this.width),
            this.top.invert().subtract(this.height),
            this.width,
            this.height
        )
    }

    flipHorizontal() {
        return new Rectangle(
            this.left.invert().subtract(this.width),
            this.top,
            this.width,
            this.height
        )
    }

    flipVertical() {
        return new Rectangle(
            this.left,
            this.top.invert().subtract(this.height),
            this.width,
            this.height
        )
    }

    swapDimensions() {
        return new Rectangle(
            this.top,
            this.left,
            this.height,
            this.width
        );
    }

    get left(): Length { return this.#left; }
    #left: Length;

    get top(): Length { return this.#top; }
    #top: Length;

    get width(): Length { return this.#width; }
    #width: Length;

    get height(): Length { return this.#height; }
    #height: Length;

    get right(): Length {
        return this.left.add(this.width);
    }

    get bottom(): Length {
        return this.top.add(this.height);
    }

    get location(): Point {
        return new Point(this.left, this.top);
    }

    get size() {
        return new Size(this.width, this.height);
    }

    get corners(): Point[] {
        return [
            new Point(this.left, this.top),
            new Point(this.right, this.top),
            new Point(this.right, this.bottom),
            new Point(this.left, this.bottom)
        ];
    }
}
