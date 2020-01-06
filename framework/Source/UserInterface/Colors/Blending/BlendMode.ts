//Documentation: https://www.w3.org/TR/compositing-1/

import { Color } from "../Color.js";
import ColorConversion from "../ColorConversion.js";
import MathX from "../../../Standard/MathX.js";

export const ColorMath = {

}

export const AuxiliaryFunctions = {
    min(c: Color): number {
        const { r: cRed, g: cGreen, b: cBlue } = ColorConversion.convertToRGBA(Number(c));
        return Math.min(cRed, cGreen, cBlue);
    },

    max(c: Color): number {
        const { r: cRed, g: cGreen, b: cBlue } = ColorConversion.convertToRGBA(Number(c));
        return Math.max(cRed, cGreen, cBlue);
    },

    mid(c: Color): number {
        const { r: cRed, g: cGreen, b: cBlue } = ColorConversion.convertToRGBA(Number(c));
        return MathX.mid(cRed, cGreen, cBlue);
    },

    lum(c: Color): number {
        const { r: cRed, g: cGreen, b: cBlue } = ColorConversion.convertToRGBA(Number(c));
        return .3 * cRed + 0.59 * cGreen + .11 * cBlue;
    },

    clipColor(c: Color): Color {
        let { r: cRed, g: cGreen, b: cBlue } = ColorConversion.convertToRGBA(Number(c));

        const l = this.lum(c),
            n = Math.min(cRed, cGreen, cBlue),
            x = Math.max(cRed, cGreen, cBlue);

        if (n < 0) {
            cRed = l + (((cRed - l) * l) / (l - n));
            cGreen = l + (((cRed - l) * l) / (l - n));
            cRed = l + (((cRed - l) * l) / (l - n));
        }
        else {

        }
    },

    setLum(c: Color, l: number): Color {

    },

    sat(c: Color): number {

    },

    setSat(c: Color, s: number): Color {

    }
};

export type BlendModeFunction = (cb: Color, cs: Color) => Color;

export abstract class BlendMode {
    constructor(b: BlendModeFunction) {
        this.__b = b;
    }

    get b(): BlendModeFunction { return this.__b; }
    private __b: BlendModeFunction;
}