import { Unit } from "./Unit";
import { assertParams } from "../../Validation/index";

const $unit = Symbol("unit");
const $value = Symbol("value");
const $isAuto = Symbol("isAuto");
const $isInvalid = Symbol("isInvalid");

export class UnitValue {
    static get zero() { return new UnitValue(0); }
    static get auto() { return new UnitValue(0, Unit.None, true); }
    static get invalid() { return new UnitValue(0, Unit.None, false, true); }
    static centimeters(value: number): UnitValue { return new UnitValue(value, Unit.Centimeters); }
    static millimeters(value: number): UnitValue { return new UnitValue(value, Unit.Millimeters); }
    static inches(value: number): UnitValue { return new UnitValue(value, Unit.Inches); }
    static pixels(value: number): UnitValue { return new UnitValue(value, Unit.Pixels); }
    static points(value: number): UnitValue { return new UnitValue(value, Unit.Points); }
    static picas(value: number): UnitValue { return new UnitValue(value, Unit.Picas); }
    static em(value: number): UnitValue { return new UnitValue(value, Unit.Em); }
    static ex(value: number): UnitValue { return new UnitValue(value, Unit.Ex); }
    static ch(value: number): UnitValue { return new UnitValue(value, Unit.Ch); }
    static rem(value: number): UnitValue { return new UnitValue(value, Unit.Rem); }
    static vw(value: number): UnitValue { return new UnitValue(value, Unit.Vw); }
    static vh(value: number): UnitValue { return new UnitValue(value, Unit.Vh); }
    static vmin(value: number): UnitValue { return new UnitValue(value, Unit.Vmin); }
    static vmax(value: number): UnitValue { return new UnitValue(value, Unit.Vmax); }
    static percent(value: number): UnitValue { return new UnitValue(value, Unit.Percent); }

    constructor(value: number, unit: number = Unit.None, isAuto: boolean = false, isInvalid: boolean = false) {
        assertParams({ value }, [Number]);
        Unit.assertFlag(unit);
        assertParams({ isAuto }, [Boolean]);
        assertParams({ isInvalid }, [Boolean]);

        this[$value] = value;
        this[$unit] = unit;
        this[$isAuto] = isAuto;
        this[$isInvalid] = isInvalid;
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