import { LengthUnit } from "./length-unit.js";
import { assertParams } from "../../validation/index.js";
import { Orientation } from "./orientation.js";
import * as UnitConversion from "./unit-conversion.js";

export class Length {
    static get zero() { return ZERO; }

    static get auto() { return AUTO; }

    static get invalid() { return new Length(0, LengthUnit.None, false, true); }

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

    constructor(value: number, unit: number = LengthUnit.None, isAuto: boolean = false, isInvalid: boolean = false) {
        assertParams({ value }, [Number]);
        LengthUnit.assertFlag(unit);
        assertParams({ isAuto }, [Boolean]);
        assertParams({ isInvalid }, [Boolean]);

        this.__value = value;
        this.__unit = unit;
        this.__isAuto = isAuto;
        this.__isInvalid = isInvalid;
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

    equals(other: Length): boolean {
        if (this.isInvalid)
            return other.isInvalid;
        else if (this.isAuto)
            return other.isAuto;
        else
            return this.amount == other.amount && this.unit == other.unit;
    }

    get amount(): number { return this.__value; }
    private __value: number;

    get unit(): number { return this.__unit; }
    private __unit: number;

    get isAuto(): boolean { return this.__isAuto; }
    private __isAuto: boolean;

    get isInvalid(): boolean { return this.__isInvalid; }
    private __isInvalid: boolean;
}

const ZERO = new Length(0);

const AUTO = new Length(0, LengthUnit.None, true);