import { assertParams } from "../../validation/index.js";
import { Length, LengthUnit, Orientation } from "./index.js";
import { StringUtils } from "../../core-base/utils/index.js";
import { ArgumentException } from "../../standard/exceptions/index.js";

export class Size {
    static get zero(): Size {
        return new Size(Length.zero, Length.zero);
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

    toCentimeters(): Size {
        return new Size(
            this.width.toCentimeters(),
            this.height.toCentimeters(),
        );
    }

    toMillimeters(): Size {
        return new Size(
            this.width.toMillimeters(),
            this.height.toMillimeters(),
        );
    }

    toInches(): Size {
        return new Size(
            this.width.toInches(),
            this.height.toInches(),
        );
    }

    toPixels(): Size {
        return new Size(
            this.width.toPixels(),
            this.height.toPixels(),
        );
    }

    toPoints(): Size {
        return new Size(
            this.width.toPoints(),
            this.height.toPoints(),
        );
    }

    toPicas(): Size {
        return new Size(
            this.width.toPicas(),
            this.height.toPicas(),
        );
    }

    toEm(element: Element): Size {
        assertParams({ element }, [Element]);

        return new Size(
            this.width.toEm(element),
            this.height.toEm(element),
        );
    }

    toEx(element: Element): Size {
        assertParams({ element }, [Element]);

        return new Size(
            this.width.toEx(element),
            this.height.toEx(element),
        );
    }

    toCh(element: Element): Size {
        assertParams({ element }, [Element]);

        return new Size(
            this.width.toCh(element),
            this.height.toCh(element),
        );
    }

    toRem(): Size {
        return new Size(
            this.width.toRem(),
            this.height.toRem(),
        );
    }

    toVw(): Size {
        return new Size(
            this.width.toVw(),
            this.height.toVw(),
        );
    }

    toVh(): Size {
        return new Size(
            this.width.toVh(),
            this.height.toVh(),
        );
    }

    toVmin(): Size {
        return new Size(
            this.width.toVmin(),
            this.height.toVmin(),
        );
    }

    toVmax(): Size {
        return new Size(
            this.width.toVmax(),
            this.height.toVmax(),
        );
    }

    toPercent(element: Element, orientation: number): Size {
        assertParams({ element }, [Element]);
        Orientation.assertFlag(orientation);

        return new Size(
            this.width.toPercent(element, Orientation.Horizontal),
            this.height.toPercent(element, Orientation.Vertical),
        );

    }

    convertImplicitly(unit: number): Size {
        assertParams({ unit }, [Number]);
        LengthUnit.assertFlag(unit);

        return new Size(
            this.width.convertImplicitly(unit),
            this.height.convertImplicitly(unit),
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