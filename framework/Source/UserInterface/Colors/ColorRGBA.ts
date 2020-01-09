import ColorConversion from "./ColorConversion.js";
import { Color } from "./Color.js";

export class ColorRGBA extends Number {
    constructor(r: number, g: number, b: number, a: number) {
        const value = ColorConversion.convertFromRGBA({ r, g, b, a });
        super(value);

        this.__r = r;
        this.__g = g;
        this.__b = b;
        this.__a = a;
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
