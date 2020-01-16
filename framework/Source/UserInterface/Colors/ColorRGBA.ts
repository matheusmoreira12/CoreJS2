﻿import { ColorConversion } from "./index.js";
import { Color } from "./index.js";

export class ColorRGBA extends Color {
    constructor(r: number, g: number, b: number, a: number) {
        const value = ColorConversion.convertFromRGBA(r, g, b, a);
        super(value);

        this.__r = r;
        this.__g = g;
        this.__b = b;
        this.__a = a;
    }

    toString() {
        return `rgba(${this.r * 100}%, ${this.g * 100}%, ${this.b * 100}%, ${this.a * 100}%)`;
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