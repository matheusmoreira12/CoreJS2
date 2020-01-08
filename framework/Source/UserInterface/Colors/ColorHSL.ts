import { Color } from "./Color";
import ColorConversion from "./ColorConversion";

export class ColorHSL extends Color {
    constructor(h: number, s: number, l: number) {
        const rgb = ColorConversion.convertHSLtoRGB({ h, s, l });
        const value = ColorConversion.convertFromRGBA({ ...rgb, a: 1 });
        super(value);

        this.__h = h;
        this.__s = s;
        this.__l = l;
    }

    get h(): number { return this.__h; }
    private __h: number;

    get s(): number { return this.__s; }
    private __s: number;

    get l(): number { return this.__l; }
    private __l: number;
}