import { Color, ColorRGB } from "../index.js";
import _ColorConversion from "../_color-conversion.js";
import { BlendMode } from "./index.js";

export type SeparableBlendModeFunction = (cb: number, cs: number) => number;

export class SeparableBlendMode extends BlendMode {
    constructor(b: SeparableBlendModeFunction) {
        super();
        this.__b = b;
    }

    public blend(cb: Color, cs: Color): Color {
        const cbRGB = _ColorConversion.convertToRGB(Number(cb)), //Convert base color to RGB
            csRGB = _ColorConversion.convertToRGB(Number(cs)); //Convert source color to RGB
        return new ColorRGB(this.b(cbRGB.r, csRGB.r), // Blend red channel
            this.b(cbRGB.g, csRGB.g), // Blend green channel
            this.b(cbRGB.b, csRGB.b)); // Blend blue channel
    }

    get b(): SeparableBlendModeFunction { return this.__b; }
    private __b: SeparableBlendModeFunction;
}
