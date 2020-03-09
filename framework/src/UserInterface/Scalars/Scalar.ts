import { VisualUnit } from "./VisualUnit";

const $unit = Symbol();
const $value = Symbol();

export class Scalar {
    constructor(value: number, unit: number = VisualUnit.None) {
        VisualUnit.assertFlag(unit);

        this[$value] = value;
        this[$unit] = unit;
    }

    get amount(): number { return this[$value]; }
    private [$value]: number;

    get unit(): number { return this[$unit]; }
    private [$unit]: number;
}