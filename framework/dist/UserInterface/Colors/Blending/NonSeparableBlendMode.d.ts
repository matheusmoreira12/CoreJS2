import { Color } from "../index.js";
import { BlendMode } from "./index.js";
export declare type NonSeparableBlendModeFunction = (cb: Color, cs: Color) => Color;
export declare class NonSeparableBlendMode extends BlendMode {
    constructor(b: NonSeparableBlendModeFunction);
    blend(cb: Color, cs: Color): Color;
    get b(): NonSeparableBlendModeFunction;
    private __b;
}
