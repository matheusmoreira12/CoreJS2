import { Length, LengthUnit, Orientation } from "./index.js";
import { assertParams } from "../../validation/index.js";

export class Point {
    static get zero(): Point {
        return new Point(
            Length.zero,
            Length.zero
        )
    };

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

    toCentimeters(element: Element | null = null): Point {
        return this.convert(LengthUnit.Centimeters, element);
    }

    toMillimeters(element: Element | null = null): Point {
        return this.convert(LengthUnit.Millimeters, element);
    }

    toInches(element: Element | null = null): Point {
        return this.convert(LengthUnit.Inches, element);
    }

    toPixels(element: Element | null = null): Point {
        return this.convert(LengthUnit.Pixels, element);
    }

    toPoints(element: Element | null = null): Point {
        return this.convert(LengthUnit.Points, element);
    }

    toPicas(element: Element | null = null): Point {
        return this.convert(LengthUnit.Picas, element);
    }

    toEm(element: Element | null = null): Point {
        return this.convert(LengthUnit.Em, element);
    }

    toEx(element: Element | null = null): Point {
        return this.convert(LengthUnit.Ex, element);
    }

    toCh(element: Element | null = null): Point {
        return this.convert(LengthUnit.Ch, element);
    }

    toRem(element: Element | null = null): Point {
        return this.convert(LengthUnit.Rem, element);
    }

    toVw(element: Element | null = null): Point {
        return this.convert(LengthUnit.Vw, element);
    }

    toVh(element: Element | null = null): Point {
        return this.convert(LengthUnit.Vh, element);
    }

    toVmin(element: Element | null = null): Point {
        return this.convert(LengthUnit.Vmin, element);
    }

    toVmax(element: Element | null = null): Point {
        return this.convert(LengthUnit.Vmax, element);
    }

    toPercent(element: Element | null = null): Point {
        return this.convert(LengthUnit.Percent, element);
    }

    convert(unit: number, element: Element | null = null): Point {
        assertParams({ unit }, [Number]);
        LengthUnit.assertFlag(unit);
        assertParams({ element }, [Element, null]);

        return new Point(
            this.x.convert(unit),
            this.y.convert(unit),
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