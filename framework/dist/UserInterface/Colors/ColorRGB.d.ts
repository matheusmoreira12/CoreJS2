import { Color } from "./index.js";
export declare class ColorRGB extends Color {
    constructor(r: number, g: number, b: number);
    toString(): string;
    get r(): number;
    private __r;
    get g(): number;
    private __g;
    get b(): number;
    private __b;
}
