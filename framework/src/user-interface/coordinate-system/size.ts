import { assertParams } from "../../validation/index.js";
import { Length, LengthUnit, Orientation } from "./index.js";
import { StringUtils } from "../../core-base/utils/index.js";
import { ArgumentException } from "../../standard/exceptions/index.js";

export class Size {
    static get zero(): Size {
        return new Size(
            Length.zero,
            Length.zero
        );
    };

    static getCentimeters(width: number, height: number): Size {
        return new Size(
            Length.getCentimeters(width),
            Length.getCentimeters(height)
        );
    }

    static getMillimeters(width: number, height: number): Size {
        return new Size(
            Length.getMillimeters(width),
            Length.getMillimeters(height)
        );
    }

    static getInches(width: number, height: number): Size {
        return new Size(
            Length.getInches(width),
            Length.getInches(height)
        );
    }

    static getPixels(width: number, height: number): Size {
        return new Size(
            Length.getPixels(width),
            Length.getPixels(height)
        );
    }

    static getPoints(width: number, height: number): Size {
        return new Size(
            Length.getPoints(width),
            Length.getPoints(height)
        );
    }

    static getPicas(width: number, height: number): Size {
        return new Size(
            Length.getPicas(width),
            Length.getPicas(height)
        );
    }

    static getEm(width: number, height: number): Size {
        return new Size(
            Length.getEm(width),
            Length.getEm(height)
        );
    }

    static getEx(width: number, height: number): Size {
        return new Size(
            Length.getEx(width),
            Length.getEx(height)
        );
    }

    static getCh(width: number, height: number): Size {
        return new Size(
            Length.getCh(width),
            Length.getCh(height)
        );
    }

    static getRem(width: number, height: number): Size {
        return new Size(
            Length.getRem(width),
            Length.getRem(height)
        );
    }

    static getVw(width: number, height: number): Size {
        return new Size(
            Length.getVw(width),
            Length.getVw(height)
        );
    }

    static getVh(width: number, height: number): Size {
        return new Size(
            Length.getVh(width),
            Length.getVh(height)
        );
    }

    static getVmin(width: number, height: number): Size {
        return new Size(
            Length.getVmin(width),
            Length.getVmin(height)
        );
    }

    static getVmax(width: number, height: number): Size {
        return new Size(
            Length.getVmax(width),
            Length.getVmax(height)
        );
    }

    static getPercent(width: number, height: number): Size {
        return new Size(
            Length.getPercent(width),
            Length.getPercent(height)
        );
    }

    constructor(width: Length, height: Length) {
        assertParams({ width, height }, [Length]);

        if (width.amount < 0)
            throw new ArgumentException(StringUtils.nameOf({ width }), "Width cannot be less than zero.");
        if (height.amount < 0)
            throw new ArgumentException(StringUtils.nameOf({ height }), "Height cannot be less than zero.");

        this.__width = width;
        this.__height = height;
    }

    toCentimeters(element: Element | null = null): Size {
        return this.convert(LengthUnit.Centimeters, element);
    }

    toMillimeters(element: Element | null = null): Size {
        return this.convert(LengthUnit.Millimeters, element);
    }

    toInches(element: Element | null = null): Size {
        return this.convert(LengthUnit.Inches, element);
    }

    toPixels(element: Element | null = null): Size {
        return this.convert(LengthUnit.Pixels, element);
    }

    toPoints(element: Element | null = null): Size {
        return this.convert(LengthUnit.Points, element);
    }

    toPicas(element: Element | null = null): Size {
        return this.convert(LengthUnit.Picas, element);
    }

    toEm(element: Element | null = null): Size {
        return this.convert(LengthUnit.Em, element);
    }

    toEx(element: Element | null = null): Size {
        return this.convert(LengthUnit.Ex, element);
    }

    toCh(element: Element | null = null): Size {
        return this.convert(LengthUnit.Ch, element);
    }

    toRem(element: Element | null = null): Size {
        return this.convert(LengthUnit.Rem, element);
    }

    toVw(element: Element | null = null): Size {
        return this.convert(LengthUnit.Vw, element);
    }

    toVh(element: Element | null = null): Size {
        return this.convert(LengthUnit.Vh, element);
    }

    toVmin(element: Element | null = null): Size {
        return this.convert(LengthUnit.Vmin, element);
    }

    toVmax(element: Element | null = null): Size {
        return this.convert(LengthUnit.Vmax, element);
    }

    toPercent(element: Element | null = null): Size {
        return this.convert(LengthUnit.Percent, element);
    }

    convert(unit: number, element: Element | null = null): Size {
        assertParams({ unit }, [Number]);
        LengthUnit.assertFlag(unit);
        assertParams({ element }, [Element, null]);

        return new Size(
            this.width.convert(unit),
            this.height.convert(unit),
        );
    }

    scale(factor: number) {
        assertParams({ factor }, [Number]);

        return new Size(
            this.width.multiply(factor),
            this.height.multiply(factor)
        );
    }

    swapDimensions() {
        return new Size(
            this.height,
            this.width
        );
    }

    get width(): Length { return this.__width; }
    private __width: Length;

    get height(): Length { return this.__height; }
    private __height: Length;
}