import { Color } from "./index.js";
export declare class ColorRGBA extends Color {
    constructor(r: number, g: number, b: number, a: number);
    toString(): string;
    get r(): number;
    private __r;
    get g(): number;
    private __g;
    get b(): number;
    private __b;
    get a(): number;
    private __a;
}
