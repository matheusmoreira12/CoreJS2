import { ColorRGBA } from "./index.js";
import { ColorRGB } from "./index.js";
import { ColorHSL } from "./index.js";
import { ColorHSLA } from "./index.js";
import { Blending } from "./index.js";
export declare abstract class Color extends Number {
    static fromRGBAHex(value: number): ColorRGBA;
    static fromRGBHex(value: number): ColorRGB;
    constructor(value: number);
    abstract toString(): string;
    toRGBA(): ColorRGBA;
    toRGB(): ColorRGB;
    toHSL(): ColorHSL;
    toHSLA(): ColorHSLA;
    blend(color: Color, blendMode: Blending.BlendMode): Color;
}
