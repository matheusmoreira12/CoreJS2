import { UnitValue } from "./UnitValue";
import { AutoValue } from "./AutoValue";

export abstract class GraphicValue {
    static get Zero(): UnitValue { return ZERO; }
    static get Auto(): AutoValue { return AUTO; }
}

const ZERO = new UnitValue(0);
const AUTO = new AutoValue();