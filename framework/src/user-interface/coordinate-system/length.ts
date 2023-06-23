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

    static max(a: Length, b: Length) {
        assertParams({ a, b }, [Length]);

        return new Length(
            Math.max(a.amount, b.convert(a.unit).amount),
            a.unit
        );
    }

    static min(a: Length, b: Length) {
        assertParams({ a, b }, [Length]);

        return new Length(
            Math.min(a.amount, b.convert(a.unit).amount),
            a.unit
        );
    }

    constructor(value: number, unit: number = LengthUnit.None) {
        assertParams({ value }, [Number]);
        LengthUnit.assertFlag(unit);

        this.#amount = value;
        this.#unit = unit;
    }

    toCentimeters(element: Element | null = null, orientation: number | null = null): Length {
        return this.convert(LengthUnit.Centimeters, element, orientation);
    }

    toMillimeters(element: Element | null = null, orientation: number | null = null): Length {
        return this.convert(LengthUnit.Millimeters, element, orientation);
    }

    toInches(element: Element | null = null, orientation: number | null = null): Length {
        return this.convert(LengthUnit.Inches, element, orientation);
    }

    toPixels(element: Element | null = null, orientation: number | null = null): Length {
        return this.convert(LengthUnit.Pixels, element, orientation);
    }

    toPoints(element: Element | null = null, orientation: number | null = null): Length {
        return this.convert(LengthUnit.Points, element, orientation);
    }

    toPicas(element: Element | null = null, orientation: number | null = null): Length {
        return this.convert(LengthUnit.Picas, element, orientation);
    }

    toEm(element: Element | null = null, orientation: number | null = null): Length {
        return this.convert(LengthUnit.Em, element, orientation);
    }

    toEx(element: Element | null = null, orientation: number | null = null): Length {
        return this.convert(LengthUnit.Ex, element, orientation);
    }

    toCh(element: Element | null = null, orientation: number | null = null): Length {
        return this.convert(LengthUnit.Ch, element, orientation);
    }

    toRem(element: Element | null = null, orientation: number | null = null): Length {
        return this.convert(LengthUnit.Rem, element, orientation);
    }

    toVw(element: Element | null = null, orientation: number | null = null): Length {
        return this.convert(LengthUnit.Vw, element, orientation);
    }

    toVh(element: Element | null = null, orientation: number | null = null): Length {
        return this.convert(LengthUnit.Vh, element, orientation);
    }

    toVmin(element: Element | null = null, orientation: number | null = null): Length {
        return this.convert(LengthUnit.Vmin, element, orientation);
    }

    toVmax(element: Element | null = null, orientation: number | null = null): Length {
        return this.convert(LengthUnit.Vmax, element, orientation);
    }

    toPercent(element: Element | null = null, orientation: number | null = null): Length {
        return this.convert(LengthUnit.Percent, element, orientation);
    }

    convert(unit: number, element: Element | null = null, orientation: number | null = null): Length {
        assertParams({ unit }, [Number]);
        assertParams({element}, [Element, null]);
        assertParams({orientation}, [Number, null]);

        return new Length(this.amount + __UnitConversion.convert(this.amount, this.unit, unit, element, orientation), this.unit);
    }

    equals(length: Length): boolean {
        assertParams({ length }, [Length]);

        return this.amount == length.convert(this.unit).amount;
    }

    greaterThan(length: Length): boolean {
        assertParams({ length }, [Length]);

        return this.amount >= length.convert(this.unit).amount;
    }

    lessThan(length: Length): boolean {
        assertParams({ length }, [Length]);

        return this.amount <= length.convert(this.unit).amount;
    }

    greaterThanOrEquals(length: Length): boolean {
        assertParams({ length }, [Length]);

        return this.amount >= length.convert(this.unit).amount;
    }

    lessThanOrEquals(length: Length): boolean {
        assertParams({ length }, [Length]);

        return this.amount <= length.convert(this.unit).amount;
    }

    invert(): Length {
        return new Length(-this.amount, this.unit);
    }

    add(length: Length) {
        assertParams({ length }, [Length]);

        return new Length(this.amount + length.convert(this.unit).amount, this.unit);
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