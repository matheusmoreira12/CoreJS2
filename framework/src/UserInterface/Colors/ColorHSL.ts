import { Color } from "./index";
import { ColorConversion } from "./index";

export class ColorHSL extends Color {
    constructor(h: number, s: number, l: number) {
        const rgb = ColorConversion.convertHSLtoRGB(h, s, l);
        const value = ColorConversion.convertFromRGBA(rgb.r, rgb.g, rgb.b, 1);
        super(value);

        this.__h = h;
        this.__s = s;
        this.__l = l;
    }

    toString() {
        return `hsl(${this.h}deg, ${this.s * 100}%, ${this.l * 100}%)`;
    }

    get h(): number { return this.__h; }
    private __h: number;

    get s(): number { return this.__s; }
    private __s: number;

    get l(): number { return this.__l; }
    private __l: number;
}