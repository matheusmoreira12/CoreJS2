import { GraphicUnit } from "./GraphicUnit";

const $unit = Symbol("unit");
const $value = Symbol("value");

export class GraphicValue {
    static get Zero() { return GRAPHIC_VALUE_ZERO; }

    constructor(value: number, unit: number = GraphicUnit.None) {
        GraphicUnit.assertFlag(unit);

        this[$value] = value;
        this[$unit] = unit;
    }

    get amount(): number { return this[$value]; }
    private [$value]: number;

    get unit(): number { return this[$unit]; }
    private [$unit]: number;
}

const GRAPHIC_VALUE_ZERO = new GraphicValue(0);