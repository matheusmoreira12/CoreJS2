import { ArrayUtils, StringUtils } from "../../core-base/utils/index.js";
import { ArgumentException } from "../../standard/exceptions/index.js";
import { assertParams } from "../../validation/index.js";
import { Length, LengthUnit, Orientation, Point, Size, RectangularOffset } from "./index.js";

export class Rectangle {
    static get zero(): Rectangle {
        return new Rectangle(Length.zero, Length.zero, Length.zero, Length.zero);
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
        assertParams({ left, top, width, height }, [Point]);

        if (width.amount < 0)
            throw new ArgumentException(StringUtils.nameOf({ width }), "Width cannot be less than zero.");
        if (height.amount < 0)
            throw new ArgumentException(StringUtils.nameOf({ height }), "Height cannot be less than zero.");

        this.#left = left;
        this.#top = top;
        this.#width = width;
        this.#height = height;
    }

    toCentimeters(): Rectangle {
        return new Rectangle(
            this.left.toCentimeters(),
            this.top.toCentimeters(),
            this.width.toCentimeters(),
            this.height.toCentimeters()
        );
    }

    toMillimeters(): Rectangle {
        return new Rectangle(
            this.left.toMillimeters(),
            this.top.toMillimeters(),
            this.width.toMillimeters(),
            this.height.toMillimeters()
        );
    }

    toInches(): Rectangle {
        return new Rectangle(
            this.left.toInches(),
            this.top.toInches(),
            this.width.toInches(),
            this.height.toInches()
        );
    }

    toPixels(): Rectangle {
        return new Rectangle(
            this.left.toPixels(),
            this.top.toPixels(),
            this.width.toPixels(),
            this.height.toPixels()
        );
    }

    toPoints(): Rectangle {
        return new Rectangle(
            this.left.toPoints(),
            this.top.toPoints(),
            this.width.toPoints(),
            this.height.toPoints()
        );
    }

    toPicas(): Rectangle {
        return new Rectangle(
            this.left.toPicas(),
            this.top.toPicas(),
            this.width.toPicas(),
            this.height.toPicas()
        );

    }

    toEm(element: Element): Rectangle {
        assertParams({ element }, [Element]);

        return new Rectangle(
            this.left.toEm(element),
            this.top.toEm(element),
            this.width.toEm(element),
            this.height.toEm(element)
        );
    }

    toEx(element: Element): Rectangle {
        assertParams({ element }, [Element]);

        return new Rectangle(
            this.left.toEx(element),
            this.top.toEx(element),
            this.width.toEx(element),
            this.height.toEx(element)
        );
    }

    toCh(element: Element): Rectangle {
        assertParams({ element }, [Element]);

        return new Rectangle(
            this.left.toCh(element),
            this.top.toCh(element),
            this.width.toCh(element),
            this.height.toCh(element)
        );
    }

    toRem(): Rectangle {
        return new Rectangle(
            this.left.toRem(),
            this.top.toRem(),
            this.width.toRem(),
            this.height.toRem()
        );
    }

    toVw(): Rectangle {
        return new Rectangle(
            this.left.toVw(),
            this.top.toVw(),
            this.width.toVw(),
            this.height.toVw()
        );
    }

    toVh(): Rectangle {
        return new Rectangle(
            this.left.toVh(),
            this.top.toVh(),
            this.width.toVh(),
            this.height.toVh()
        );
    }

    toVmin(): Rectangle {
        return new Rectangle(
            this.left.toVmin(),
            this.top.toVmin(),
            this.width.toVmin(),
            this.height.toVmin()
        );
    }

    toVmax(): Rectangle {
        return new Rectangle(
            this.left.toVmax(),
            this.top.toVmax(),
            this.width.toVmax(),
            this.height.toVmax()
        );
    }

    toPercent(element: Element, orientation: number): Rectangle {
        assertParams({ element }, [Element]);
        Orientation.assertFlag(orientation);

        return new Rectangle(
            this.left.toPercent(element, Orientation.Horizontal),
            this.top.toPercent(element, Orientation.Vertical),
            this.width.toPercent(element, Orientation.Horizontal),
            this.height.toPercent(element, Orientation.Vertical)
        );

    }

    convertImplicitly(unit: number): Rectangle {
        assertParams({ unit }, [Number]);
        LengthUnit.assertFlag(unit);

        return new Rectangle(
            this.left.convertImplicitly(unit),
            this.top.convertImplicitly(unit),
            this.width.convertImplicitly(unit),
            this.height.convertImplicitly(unit)
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
