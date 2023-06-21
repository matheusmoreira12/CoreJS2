import { InvalidOperationException } from "../../standard/exceptions/index.js";
import { assertParams } from "../../validation/index.js";
import { LengthUnit, Orientation } from "./index.js";
import * as UnitConversion from "./unit-conversion.js";

export class Length {
    static get zero(): Length { return ZERO; }

    static get infinity(): Length { return INFINITY; }

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

    toCentimeters(): number { return UnitConversion.convert(this.amount, this.unit, LengthUnit.Centimeters)!; }

    toMillimeters(): number { return UnitConversion.convert(this.amount, this.unit, LengthUnit.Millimeters)!; }

    toInches(): number { return UnitConversion.convert(this.amount, this.unit, LengthUnit.Inches)!; }

    toPixels(): number { return UnitConversion.convert(this.amount, this.unit, LengthUnit.Pixels)!; }

    toPoints(): number { return UnitConversion.convert(this.amount, this.unit, LengthUnit.Points)!; }

    toPicas(): number { return UnitConversion.convert(this.amount, this.unit, LengthUnit.Picas)!; }

    toEm(element: Element): number {
        assertParams({ element }, [Element]);

        return UnitConversion.convert(this.amount, this.unit, LengthUnit.Em, element)!;
    }

    toEx(element: Element): number {
        assertParams({ element }, [Element]);

        return UnitConversion.convert(this.amount, this.unit, LengthUnit.Ex, element)!;
    }

    toCh(element: Element): number {
        assertParams({ element }, [Element]);

        return UnitConversion.convert(this.amount, this.unit, LengthUnit.Ch, element)!;
    }

    toRem(): number { return UnitConversion.convert(this.amount, this.unit, LengthUnit.Rem)!; }

    toVw(): number { return UnitConversion.convert(this.amount, this.unit, LengthUnit.Vw)!; }

    toVh(): number { return UnitConversion.convert(this.amount, this.unit, LengthUnit.Vh)!; }

    toVmin(): number { return UnitConversion.convert(this.amount, this.unit, LengthUnit.Vmin)!; }

    toVmax(): number { return UnitConversion.convert(this.amount, this.unit, LengthUnit.Vmax)!; }

    toPercent(element: Element, orientation: number): number {
        assertParams({ element }, [Element]);
        Orientation.assertFlag(orientation);

        return UnitConversion.convert(this.amount, this.unit, LengthUnit.Percent, element, orientation)!;
    }

    convertImplicitly(unit: number) {
        assertParams({ unit: unit }, [Number]);
        LengthUnit.assertFlag(unit);

        if (this.unit == unit)
            return this;

        if (UnitConversion.isUnitRelative(unit) ||
            UnitConversion.isUnitRelative(this.unit))
            throw new InvalidOperationException("Cannot convert length. Relative units are not implicitly convertible.");

        return new Length(this.amount + UnitConversion.convert(this.amount, this.unit, unit)!, this.unit);
    }

    add(length: Length) {
        assertParams({ length }, [Length]);

        return new Length(this.amount + length.convertImplicitly(this.unit).amount, this.unit);
    }

    subtract(length: Length) {
        assertParams({ length }, [Length]);

        return new Length(this.amount - length.convertImplicitly(this.unit).amount, this.unit);
    }

    multiply(factor: number) {
        assertParams({ length }, [Number]);

        return new Length(this.amount * factor, this.unit);
    }

    get amount(): number { return this.#amount; }
    #amount: number;

    get unit(): number { return this.#unit; }
    #unit: number;
}

const ZERO = new Length(0);

const INFINITY = new Length(Infinity);