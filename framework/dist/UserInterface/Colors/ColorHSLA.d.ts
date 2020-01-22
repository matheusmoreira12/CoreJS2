import { Color } from "./index.js";
export declare class ColorHSLA extends Color {
    constructor(h: number, s: number, l: number, a: number);
    toString(): string;
    get h(): number;
    private __h;
    get s(): number;
    private __s;
    get l(): number;
    private __l;
    get a(): number;
    private __a;
}
