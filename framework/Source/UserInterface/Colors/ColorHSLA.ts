import { Color } from "./Color";
import ColorConversion from "./ColorConversion";

export class ColorHSLA extends Color {
    constructor(h: number, s: number, l: number, a: number) {
        const rgb = ColorConversion.convertHSLtoRGB({ h, s, l });
        const value = ColorConversion.convertFromRGBA({ ...rgb, a });
        super(value);

        this.__h = h;
        this.__s = s;
        this.__l = l;
        this.__a = a;
    }

    get h(): number { return this.__h; }
    private __h: number;

    get s(): number { return this.__s; }
    private __s: number;

    get l(): number { return this.__l; }
    private __l: number;

    get a(): number { return this.__a; }
    private __a: number;
}