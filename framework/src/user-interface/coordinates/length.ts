import { InvalidOperationException } from "../../standard/exceptions/index.js";
import { assertParams } from "../../validation/index.js";
import { LengthUnit, Orientation } from "./index.js";
import { __UnitConversion } from "./__unit-conversion.js";

export class Length {
    static get zero(): Length { return new Length(0) }

    static get positiveInfinity(): Length { return new Length(Number.POSITIVE_INFINITY); }

    static get negativeInfinity(): Length { return new Length(Number.NEGATIVE_INFINITY); }

    static getCentimeters(value: number): Length {
        assertParams({ value }, [Number]);

        return new Length(value, LengthUnit.Centimeters);
    }

    static getMillimeters(value: number): Length {
        assertParams({ value }, [Number]);

        return new Length(value, LengthUnit.Millimeters);
    }

    static getInches(value: number): Length {
        assertParams({ value }, [Number]);

        return new Length(value, LengthUnit.Inches);
    }

    static getPixels(value: number): Length {
        assertParams({ value }, [Number]);

        return new Length(value, LengthUnit.Pixels);
    }

    static getPoints(value: number): Length {
        assertParams({ value }, [Number]);

        return new Length(value, LengthUnit.Points);
    }

    static getPicas(value: number): Length {
        assertParams({ value }, [Number]);

        return new Length(value, LengthUnit.Picas);
    }

    static getEm(value: number): Length {
        assertParams({ value }, [Number]);

        return new Length(value, LengthUnit.Em);
    }

    static getEx(value: number): Length {
        assertParams({ value }, [Number]);

        return new Length(value, LengthUnit.Ex);
    }

    static getCh(value: number): Length {
        assertParams({ value }, [Number]);

        return new Length(value, LengthUnit.Ch);
    }

    static getRem(value: number): Length {
        assertParams({ value }, [Number]);

        return new Length(value, LengthUnit.Rem);
    }

    static getVw(value: number): Length {
        assertParams({ value }, [Number]);

        return new Length(value, LengthUnit.Vw);
    }

    static getVh(value: number): Length {
        assertParams({ value }, [Number]);

        return new Length(value, LengthUnit.Vh);
    }

    static getVmin(value: number): Length {
        assertParams({ value }, [Number]);

        return new Length(value, LengthUnit.Vmin);
    }

    static getVmax(value: number): Length {
        assertParams({ value }, [Number]);

        return new Length(value, LengthUnit.Vmax);
    }

    static getPercent(value: number): Length {
        assertParams({ value }, [Number]);

        return new Length(value, LengthUnit.Percent);
    }

    constructor(value: number, unit: number = LengthUnit.None) {
        assertParams({ value }, [Number]);
        LengthUnit.assertFlag(unit);

        this.#amount = value;
        this.#unit = unit;
    }

    toCentimeters(): Length {
        return new Length(
            __UnitConversion.convert(this.amount, this.unit, LengthUnit.Centimeters),
            LengthUnit.Centimeters
        );
    }

    toMillimeters(): Length {
        return new Length(
            __UnitConversion.convert(this.amount, this.unit, LengthUnit.Millimeters),
            LengthUnit.Millimeters
        );
    }

    toInches(): Length {
        return new Length(
            __UnitConversion.convert(this.amount, this.unit, LengthUnit.Inches),
            LengthUnit.Inches
        );
    }

    toPixels(): Length {
        return new Length(
            __UnitConversion.convert(this.amount, this.unit, LengthUnit.Pixels),
            LengthUnit.Pixels
        );
    }

    toPoints(): Length {
        return new Length(
            __UnitConversion.convert(this.amount, this.unit, LengthUnit.Points),
            LengthUnit.Points
        );
    }

    toPicas(): Length {
        return new Length(
            __UnitConversion.convert(this.amount, this.unit, LengthUnit.Picas),
            LengthUnit.Picas
        );
    }

    toEm(element: Element): Length {
        assertParams({ element }, [Element]);

        return new Length(
            __UnitConversion.convert(this.amount, this.unit, LengthUnit.Em, element),
            LengthUnit.Em
        );
    }

    toEx(element: Element): Length {
        assertParams({ element }, [Element]);

        return new Length(
            __UnitConversion.convert(this.amount, this.unit, LengthUnit.Ex, element),
            LengthUnit.Ex
        );
    }

    toCh(element: Element): Length {
        assertParams({ element }, [Element]);

        return new Length(
            __UnitConversion.convert(this.amount, this.unit, LengthUnit.Ch, element),
            LengthUnit.Ch
        );
    }

    toRem(): Length {
        return new Length(
            __UnitConversion.convert(this.amount, this.unit, LengthUnit.Rem),
            LengthUnit.Rem
        );
    }

    toVw(): Length {
        return new Length(
            __UnitConversion.convert(this.amount, this.unit, LengthUnit.Vw),
            LengthUnit.Vw
        );
    }

    toVh(): Length {
        return new Length(
            __UnitConversion.convert(this.amount, this.unit, LengthUnit.Vh),
            LengthUnit.Vh
        );
    }

    toVmin(): Length {
        return new Length(
            __UnitConversion.convert(this.amount, this.unit, LengthUnit.Vmin),
            LengthUnit.Vmin
        );
    }

    toVmax(): Length {
        return new Length(
            __UnitConversion.convert(this.amount, this.unit, LengthUnit.Vmax),
            LengthUnit.Vmax
        );
    }

    toPercent(element: Element, orientation: number): Length {
        assertParams({ element }, [Element]);
        assertParams({ orientation }, [Number]);
        Orientation.assertFlag(orientation);

        return new Length(
            __UnitConversion.convert(this.amount, this.unit, LengthUnit.Percent, element, orientation),
            LengthUnit.Percent
        );
    }

    convertImplicitly(unit: number): Length {
        assertParams({ unit }, [Number]);
        LengthUnit.assertFlag(unit);

        if (this.unit == unit)
            return this;

        if (__UnitConversion.isUnitRelative(unit) ||
            __UnitConversion.isUnitRelative(this.unit))
            throw new InvalidOperationException("Cannot convert length. Relative units are not implicitly convertible.");

        return new Length(this.amount + __UnitConversion.convert(this.amount, this.unit, unit), this.unit);
    }

    invert(): Length {
        return new Length(-this.amount, this.unit);
    }

    add(length: Length) {
        assertParams({ length }, [Length]);

        return new Length(this.amount + length.convertImplicitly(this.unit).amount, this.unit);
    }

    subtract(length: Length) {
        assertParams({ length }, [Length]);

        return this.add(length.invert());
    }

    multiply(factor: number) {
        assertParams({ factor }, [Number]);

        return new Length(this.amount * factor, this.unit);
    }

    get amount(): number { return this.#amount; }
    #amount: number;

    get unit(): number { return this.#unit; }
    #unit: number;

    get isZero() {
        return this.amount == 0;
    }

    get isInfinity(): boolean {
        return this.isPositiveInfinity || this.isNegativeInfinity;
    }

    get isPositiveInfinity(): boolean {
        return this.amount == Number.POSITIVE_INFINITY;
    }

    get isNegativeInfinity(): boolean {
        return this.amount == Number.NEGATIVE_INFINITY;
    }
}