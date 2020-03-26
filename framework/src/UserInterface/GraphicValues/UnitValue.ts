import { Unit } from "./Unit";

const $unit = Symbol("unit");
const $value = Symbol("value");

export class UnitValue {
    constructor(value: number, unit: number = Unit.None) {
        Unit.assertFlag(unit);

        this[$value] = value;
        this[$unit] = unit;
    }

    get amount(): number { return this[$value]; }
    private [$value]: number;

    get unit(): number { return this[$unit]; }
    private [$unit]: number;
}