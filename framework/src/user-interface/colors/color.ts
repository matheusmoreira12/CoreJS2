import { ColorConversion } from "./index.js";
import { ArgumentOutOfRangeException, InvalidOperationException } from "../../standard/exceptions/index.js";
import { ColorRGBA } from "./index.js";
import { ColorRGB } from "./index.js";
import { ColorHSL } from "./index.js";
import { ColorHSLA } from "./index.js";

import { Blending } from "./index.js";
import { TryOutput } from "../../standard/reflection/types.js";

export abstract class Color extends Number {
    static fromRGBAHex(value: number): ColorRGBA {
        const { r, g, b, a } = ColorConversion.convertToRGBA(value);
        return new ColorRGBA(r, g, b, a);
    }

    static fromRGBHex(value: number): ColorRGB {
        const { r, g, b } = ColorConversion.convertToRGB(value);
        return new ColorRGB(r, g, b);
    }

    static fromShortenedRGBHex(value: number): ColorRGBA {
        const valueHex = (value & 0xF) * 0x11 | // Opacity channel
            ((value & 0xF0) >> 4) * 0x1100 | // Blue channel
            ((value & 0xF00) >> 8) * 0x110000 | // Green channel
            ((value & 0xF000) >> 12) * 0x11000000; // Red channel
        const { r, g, b, a } = ColorConversion.convertToRGBA(valueHex);
        return new ColorRGBA(r, g, b, a);
    }

    static fromShortenedRGBAHex(value: number): ColorRGB {
        const valueHex = (value & 0xF) * 0x11 | // Blue channel
            ((value & 0xF0) >> 4) * 0x1100 | // Green channel
            ((value & 0xF00) >> 8) * 0x110000; // Red channel
        const { r, g, b } = ColorConversion.convertToRGB(valueHex);
        return new ColorRGB(r, g, b);
    }

    static tryParse(value: string, output: TryOutput<Color>): boolean {
        return ColorRGB.tryParse(value, <any>output) || // Try parsing RGB color
            ColorRGBA.tryParse(value, <any>output) || // Try parsing RGBA color 
            ColorHSL.tryParse(value, <any>output) || // Try parsing HSL color
            ColorRGB.tryParse(value, <any>output);  // Try parsing HSLA color
    }

    static parse(value: string) {
        const tryParseOutput: TryOutput<Color> = {};
        if (this.tryParse(value, tryParseOutput))
            return tryParseOutput.result!;

        throw new ArgumentOutOfRangeException("value");
    }

    constructor(value: number) {
        if (new.target === Color)
            throw new InvalidOperationException("Invalid constructor.");

        super(value);
    }

    abstract toString(): string;
         
    toRGBA(): ColorRGBA {
        const value = Number(this);
        const { r, g, b, a } = ColorConversion.convertToRGBA(value);
        return new ColorRGBA(r, g, b, a);
    }

    toRGB(): ColorRGB {
        const value = Number(this);
        const { r, g, b } = ColorConversion.convertToRGB(value);
        return new ColorRGB(r, g, b);
    }

    toHSL(): ColorHSL {
        const value = Number(this);
        const rgb = ColorConversion.convertToRGB(value);
        const { h, s, l } = ColorConversion.convertRGBtoHSL(rgb.r, rgb.g, rgb.b);
        return new ColorHSL(h, s, l);
    }

    toHSLA(): ColorHSLA {
        const value = Number(this);
        const rgba = ColorConversion.convertToRGBA(value);
        const { h, s, l } = ColorConversion.convertRGBtoHSL(rgba.r, rgba.g, rgba.b);
        return new ColorHSLA(h, s, l, rgba.a);
    }

    blend(color: Color, blendMode: Blending.BlendMode): Color {
        return blendMode.blend(this, color);
    }
}
