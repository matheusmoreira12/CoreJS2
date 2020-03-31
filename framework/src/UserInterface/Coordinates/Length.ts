import { LengthUnit } from "./LengthUnit";
import { assertParams } from "../../Validation/index";
import { Orientation } from "./Orientation";
import * as UnitConversion from "./UnitConversion";

const $unit = Symbol("unit");
const $value = Symbol("value");
const $isAuto = Symbol("isAuto");
const $isInvalid = Symbol("isInvalid");

export class Length {
    static get zero() { return ZERO; }
    static get auto() { return AUTO; }
    static get invalid() { return new Length(0, LengthUnit.None, false, true); }
    static centimeters(value: number): Length {
        assertParams({ value }, [Number]);

        return new Length(value, LengthUnit.Centimeters);
    }
    static millimeters(value: number): Length {
        assertParams({ value }, [Number]);

        return new Length(value, LengthUnit.Millimeters);
    }
    static inches(value: number): Length {
        assertParams({ value }, [Number]);

        return new Length(value, LengthUnit.Inches);
    }
    static pixels(value: number): Length {
        assertParams({ value }, [Number]);

        return new Length(value, LengthUnit.Pixels);
    }
    static points(value: number): Length {
        assertParams({ value }, [Number]);

        return new Length(value, LengthUnit.Points);
    }
    static picas(value: number): Length {
        assertParams({ value }, [Number]);

        return new Length(value, LengthUnit.Picas);
    }
    static em(value: number): Length {
        assertParams({ value }, [Number]);

        return new Length(value, LengthUnit.Em);
    }
    static ex(value: number): Length {
        assertParams({ value }, [Number]);

        return new Length(value, LengthUnit.Ex);
    }
    static ch(value: number): Length {
        assertParams({ value }, [Number]);

        return new Length(value, LengthUnit.Ch);
    }
    static rem(value: number): Length {
        assertParams({ value }, [Number]);

        return new Length(value, LengthUnit.Rem);
    }
    static vw(value: number): Length {
        assertParams({ value }, [Number]);

        return new Length(value, LengthUnit.Vw);
    }
    static vh(value: number): Length {
        assertParams({ value }, [Number]);

        return new Length(value, LengthUnit.Vh);
    }
    static vmin(value: number): Length {
        assertParams({ value }, [Number]);

        return new Length(value, LengthUnit.Vmin);
    }
    static vmax(value: number): Length {
        assertParams({ value }, [Number]);

        return new Length(value, LengthUnit.Vmax);
    }
    static percent(value: number): Length {
        assertParams({ value }, [Number]);

        return new Length(value, LengthUnit.Percent);
    }

    constructor(value: number, unit: number = LengthUnit.None, isAuto: boolean = false, isInvalid: boolean = false) {
        assertParams({ value }, [Number]);
        LengthUnit.assertFlag(unit);
        assertParams({ isAuto }, [Boolean]);
        assertParams({ isInvalid }, [Boolean]);

        this[$value] = value;
        this[$unit] = unit;
        this[$isAuto] = isAuto;
        this[$isInvalid] = isInvalid;
    }

    toCentimeters(): number { return UnitConversion.convert(this.amount, this.unit, LengthUnit.Centimeters); }
    toMillimeters(): number { return UnitConversion.convert(this.amount, this.unit, LengthUnit.Millimeters); }
    toInches(): number { return UnitConversion.convert(this.amount, this.unit, LengthUnit.Inches); }
    toPixels(): number { return UnitConversion.convert(this.amount, this.unit, LengthUnit.Pixels); }
    toPoints(): number { return UnitConversion.convert(this.amount, this.unit, LengthUnit.Points); }
    toPicas(): number { return UnitConversion.convert(this.amount, this.unit, LengthUnit.Picas); }
    toEm(element: Element): number {
        assertParams({ element }, [Element]);

        return UnitConversion.convert(this.amount, this.unit, LengthUnit.Em, element);
    }
    toEx(element: Element): number {
        assertParams({ element }, [Element]);

        return UnitConversion.convert(this.amount, this.unit, LengthUnit.Ex, element);
    }
    toCh(element: Element): number {
        assertParams({ element }, [Element]);

        return UnitConversion.convert(this.amount, this.unit, LengthUnit.Ch, element);
    }
    toRem(): number { return UnitConversion.convert(this.amount, this.unit, LengthUnit.Rem); }
    toVw(): number { return UnitConversion.convert(this.amount, this.unit, LengthUnit.Vw); }
    toVh(): number { return UnitConversion.convert(this.amount, this.unit, LengthUnit.Vh); }
    toVmin(): number { return UnitConversion.convert(this.amount, this.unit, LengthUnit.Vmin); }
    toVmax(): number { return UnitConversion.convert(this.amount, this.unit, LengthUnit.Vmax); }
    toPercent(element: Element, orientation: number): number {
        assertParams({ element }, [Element]);
        Orientation.assertFlag(orientation);

        return UnitConversion.convert(this.amount, this.unit, LengthUnit.Percent, element, orientation);
    }

    equals(other: Length): boolean {
        if (this.isInvalid)
            return other.isInvalid;
        else if (this.isAuto)
            return other.isAuto;
        else
            return this.amount == other.amount && this.unit == other.unit;
    }

    get amount(): number { return this[$value]; }
    private [$value]: number;

    get unit(): number { return this[$unit]; }
    private [$unit]: number;

    get isAuto(): boolean { return this[$isAuto]; }
    private [$isAuto]: boolean;

    get isInvalid(): boolean { return this[$isInvalid]; }
    private [$isInvalid]: boolean;
}

const ZERO = new Length(0);
const AUTO = new Length(0, LengthUnit.None, true);