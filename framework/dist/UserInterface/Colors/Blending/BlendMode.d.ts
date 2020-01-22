import { Color } from "../Color.js";
export declare abstract class BlendMode {
    constructor();
    abstract blend(cb: Color, cs: Color): Color;
}
