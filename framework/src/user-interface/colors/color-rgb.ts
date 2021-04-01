import { MathX } from "../../standard/math-x.js";
import { Color } from "./index.js";
import _ColorConversion from "./_color-conversion.js";

export class ColorRGB extends Color {
    constructor(r: number, g: number, b: number) {
        const value = _ColorConversion.convertFromRGBA(r, g, b, 1);
        super(value);
        this.__r = MathX.limitToBounds(r, 0, 1);
        this.__g = MathX.limitToBounds(g, 0, 1);
        this.__b = MathX.limitToBounds(b, 0, 1);
    }

    public get r(): number { return this.__r; }
    private __r: number;

    public get g(): number { return this.__g; }
    private __g: number;

    public get b(): number { return this.__b; }
    private __b: number;
}
