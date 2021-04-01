import { MathX } from "../../standard/index.js";
import { assertParams } from "../../validation/index.js";
import { Color } from "./index.js";
import _ColorConversion from "./_color-conversion.js";

export class ColorRGBA extends Color {
    constructor(r: number, g: number, b: number, a: number) {
        assertParams({ r, g, b, a }, [Number]);

        const value = _ColorConversion.convertFromRGBA(r, g, b, a);
        super(value);

        this.__r = MathX.limitToBounds(r, 0, 1);
        this.__g = MathX.limitToBounds(g, 0, 1);
        this.__b = MathX.limitToBounds(b, 0, 1);
        this.__a = MathX.limitToBounds(a, 0, 1);
    }

    public get r(): number { return this.__r; }
    private __r: number;

    public get g(): number { return this.__g; }
    private __g: number;

    public get b(): number { return this.__b; }
    private __b: number;

    public get a(): number { return this.__a; }
    private __a: number;
}
