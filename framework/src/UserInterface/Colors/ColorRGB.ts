import { ColorConversion } from "./index";
import { Color } from "./index";

export class ColorRGB extends Color {
    constructor(r: number, g: number, b: number) {
        const value = ColorConversion.convertFromRGBA(r, g, b, 1);
        super(value);
        this.__r = r;
        this.__g = g;
        this.__b = b;
    }

    toString() {
        return `rgb(${this.r * 100}%, ${this.g * 100}%, ${this.b * 100}%)`;
    }

    public get r(): number { return this.__r; }
    private __r: number;

    public get g(): number { return this.__g; }
    private __g: number;

    public get b(): number { return this.__b; }
    private __b: number;
}
