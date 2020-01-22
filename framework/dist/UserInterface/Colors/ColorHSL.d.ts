import { Color } from "./index.js";
export declare class ColorHSL extends Color {
    constructor(h: number, s: number, l: number);
    toString(): string;
    get h(): number;
    private __h;
    get s(): number;
    private __s;
    get l(): number;
    private __l;
}
