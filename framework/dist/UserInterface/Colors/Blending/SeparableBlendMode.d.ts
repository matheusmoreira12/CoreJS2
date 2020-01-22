import { Color } from "../index.js";
import { BlendMode } from "./index.js";
export declare type SeparableBlendModeFunction = (cb: number, cs: number) => number;
export declare class SeparableBlendMode extends BlendMode {
    constructor(b: SeparableBlendModeFunction);
    blend(cb: Color, cs: Color): Color;
    get b(): SeparableBlendModeFunction;
    private __b;
}
