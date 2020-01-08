//Documentation: https://www.w3.org/TR/compositing-1/

import { Color } from "../Color.js";
import ColorConversion from "../ColorConversion.js";
import MathX from "../../../Standard/MathX.js";
import { ColorRGB } from "../ColorRGB.js";

export const ColorMath = {

}

export const AuxiliaryFunctions = {
    min(c: Color): number {
        const { r: cRed, g: cGreen, b: cBlue } = c.toRGB();
        return Math.min(cRed, cGreen, cBlue);
    },

    max(c: Color): number {
        const { r: cRed, g: cGreen, b: cBlue } = c.toRGB();
        return Math.max(cRed, cGreen, cBlue);
    },

    mid(c: Color): number {
        const { r: cRed, g: cGreen, b: cBlue } = c.toRGB();
        return MathX.mid(cRed, cGreen, cBlue);
    },

    lum(c: Color): number {
        const { r: cRed, g: cGreen, b: cBlue } = c.toRGB();
        return .3 * cRed + 0.59 * cGreen + .11 * cBlue;
    },

    clipColor(c: Color): Color {
        let { r: cRed, g: cGreen, b: cBlue } = c.toRGB();

        const l = this.lum(c),
            n = Math.min(cRed, cGreen, cBlue),
            x = Math.max(cRed, cGreen, cBlue);

        if (n < 0) {
            cRed = l + (((cRed - l) * l) / (l - n));
            cGreen = l + (((cGreen - l) * l) / (l - n));
            cBlue = l + (((cBlue - l) * l) / (l - n));
        }

        if (x > 1) {
            cRed = l + (((cRed - l) * (1 - l)) / (x - l));
            cGreen = l + (((cGreen - l) * (1 - l)) / (x - l));
            cBlue = l + (((cBlue - l) * (1 - l)) / (x - l));
        }

        return new ColorRGB(cRed, cGreen, cBlue);
    },

    setLum(c: Color, l: number): Color {
        let { r: cRed, g: cGreen, b: cBlue } = c.toRGB();

        const d = l - this.lum(c);

        cRed = cRed + d;
        cGreen = cGreen + d;
        cBlue = cBlue + d;

        return this.clipColor(new ColorRGB(cRed, cGreen, cBlue));
    },

    sat(c: Color): number {
        return this.max(c) - this.min(c);
    },

    setSat(c: Color, s: number): Color {
        let { r: cRed, g: cGreen, b: cBlue } = c.toRGB();

        if (cRed > cGreen && cGreen > cBlue) {
            cGreen = (((cGreen - cBlue) * s) / (cRed - cBlue));
            cRed = s;
        }
        else if (cRed > cBlue && cBlue > cGreen) {
            cBlue = (((cBlue - cGreen) * s) / (cRed - cGreen));
            cRed = s;
        }
        else if (cGreen > cBlue && cBlue > cRed) {
            cBlue = (((cBlue - cRed) * s) / (cGreen - cRed));
            cGreen = s;
        }
        else if (cGreen > cRed && cRed > cBlue) {
            cRed = (((cRed - cBlue) * s) / (cGreen - cBlue));
            cGreen = s;
        }
        else if (cBlue > cRed && cRed > cGreen) {
            cRed = (((cRed - cGreen) * s) / (cBlue - cGreen));
            cBlue = s;
        }
        else if (cBlue > cGreen && cGreen > cRed) {
            cGreen = (((cGreen - cRed) * s) / (cBlue - cRed));
            cBlue = s;
        }

        return new ColorRGB(cRed, cGreen, cBlue);
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