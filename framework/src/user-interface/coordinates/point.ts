import { Length, LengthUnit, Orientation } from "./index.js";
import { assertParams } from "../../validation/index.js";

export class Point {
    static get zero(): Point { return ZERO };

    static getCentimeters(x: number, y: number): Point {
        return new Point(
            Length.getCentimeters(x),
            Length.getCentimeters(y)
        );
    }

    static getMillimeters(x: number, y: number): Point {
        return new Point(
            Length.getMillimeters(x),
            Length.getMillimeters(y)
        );
    }

    static getInches(x: number, y: number): Point {
        return new Point(
            Length.getInches(x),
            Length.getInches(y)
        );
    }

    static getPixels(x: number, y: number): Point {
        return new Point(
            Length.getPixels(x),
            Length.getPixels(y)
        );
    }

    static getPoints(x: number, y: number): Point {
        return new Point(
            Length.getPoints(x),
            Length.getPoints(y)
        );
    }

    static getPicas(x: number, y: number): Point {
        return new Point(
            Length.getPicas(x),
            Length.getPicas(y)
        );
    }

    static getEm(x: number, y: number): Point {
        return new Point(
            Length.getEm(x),
            Length.getEm(y)
        );
    }

    static getEx(x: number, y: number): Point {
        return new Point(
            Length.getEx(x),
            Length.getEx(y)
        );
    }

    static getCh(x: number, y: number): Point {
        return new Point(
            Length.getCh(x),
            Length.getCh(y)
        );
    }

    static getRem(x: number, y: number): Point {
        return new Point(
            Length.getRem(x),
            Length.getRem(y)
        );
    }

    static getVw(x: number, y: number): Point {
        return new Point(
            Length.getVw(x),
            Length.getVw(y)
        );
    }

    static getVh(x: number, y: number): Point {
        return new Point(
            Length.getVh(x),
            Length.getVh(y)
        );
    }

    static getVmin(x: number, y: number): Point {
        return new Point(
            Length.getVmin(x),
            Length.getVmin(y)
        );
    }

    static getVmax(x: number, y: number): Point {
        return new Point(
            Length.getVmax(x),
            Length.getVmax(y)
        );
    }

    static getPercent(x: number, y: number): Point {
        return new Point(
            Length.getPercent(x),
            Length.getPercent(y)
        );
    }

    constructor(x: Length, y: Length) {
        assertParams({ x, y }, [Length]);

        this.#x = x;
        this.#y = y;
    }

    toCentimeters(): Point {
        return new Point(
            this.x.toCentimeters(),
            this.y.toCentimeters(),
        );
    }

    toMillimeters(): Point {
        return new Point(
            this.x.toMillimeters(),
            this.y.toMillimeters(),
        );
    }

    toInches(): Point {
        return new Point(
            this.x.toInches(),
            this.y.toInches(),
        );
    }

    toPixels(): Point {
        return new Point(
            this.x.toPixels(),
            this.y.toPixels(),
        );
    }

    toPoints(): Point {
        return new Point(
            this.x.toPoints(),
            this.y.toPoints(),
        );
    }

    toPicas(): Point {
        return new Point(
            this.x.toPicas(),
            this.y.toPicas(),
        );
    }

    toEm(element: Element): Point {
        assertParams({ element }, [Element]);

        return new Point(
            this.x.toEm(element),
            this.y.toEm(element),
        );
    }

    toEx(element: Element): Point {
        assertParams({ element }, [Element]);

        return new Point(
            this.x.toEx(element),
            this.y.toEx(element),
        );
    }

    toCh(element: Element): Point {
        assertParams({ element }, [Element]);

        return new Point(
            this.x.toCh(element),
            this.y.toCh(element),
        );
    }

    toRem(): Point {
        return new Point(
            this.x.toRem(),
            this.y.toRem(),
        );
    }

    toVw(): Point {
        return new Point(
            this.x.toVw(),
            this.y.toVw(),
        );
    }

    toVh(): Point {
        return new Point(
            this.x.toVh(),
            this.y.toVh(),
        );
    }

    toVmin(): Point {
        return new Point(
            this.x.toVmin(),
            this.y.toVmin(),
        );
    }

    toVmax(): Point {
        return new Point(
            this.x.toVmax(),
            this.y.toVmax(),
        );
    }

    toPercent(element: Element, orientation: number): Point {
        assertParams({ element }, [Element]);
        Orientation.assertFlag(orientation);

        return new Point(
            this.x.toPercent(element, Orientation.Horizontal),
            this.y.toPercent(element, Orientation.Vertical),
        );

    }

    convertImplicitly(unit: number): Point {
        assertParams({ unit }, [Number]);
        LengthUnit.assertFlag(unit);

        return new Point(
            this.x.convertImplicitly(unit),
            this.y.convertImplicitly(unit),
        );
    }

    offset(offsetX: Length, offsetY: Length): Point {
        assertParams({ offsetX, offsetY }, [Length]);

        return new Point(
            this.x.add(offsetX),
            this.y.add(offsetY)
        );
    }

    scale(factor: number) {
        assertParams({ factor }, [Number]);

        return new Point(
            this.x.multiply(factor),
            this.y.multiply(factor)
        );
    }

    invert(): Point {
        return new Point(
            this.x.invert(),
            this.y.invert()
        );
    }

    flipHorizontal(): Point {
        return new Point(
            this.x.invert(),
            this.y
        );
    }

    flipVertical(): Point {
        return new Point(
            this.x,
            this.y.invert()
        );
    }

    swapDimensions() {
        return new Point(
            this.y,
            this.x
        );
    }

    get x(): Length { return this.#x; }
    #x: Length;

    get y(): Length { return this.#y; }
    #y: Length;
}

const ZERO = new Point(Length.zero, Length.zero);