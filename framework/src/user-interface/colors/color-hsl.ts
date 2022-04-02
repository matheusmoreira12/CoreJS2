import { MathX } from "../../standard/index.js";
import { Color } from "./index.js";
import _ColorConversion from "./_color-conversion.js";

export class ColorHSL extends Color {
    constructor(h: number, s: number, l: number) {
        const rgb = _ColorConversion.convertHSLtoRGB(h, s, l);
        const value = _ColorConversion.convertFromRGBA(rgb.r, rgb.g, rgb.b, 1);
        super(value);

        this.__h = h % 360;
        this.__s = MathX.limitToBounds(s, 0, 1);
        this.__l = MathX.limitToBounds(l, 0, 1);
    }

    get h(): number { return this.__h; }
    private __h: number;

    get s(): number { return this.__s; }
    private __s: number;

    get l(): number { return this.__l; }
    private __l: number;
}