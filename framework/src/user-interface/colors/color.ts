import { WebColors } from "./index.js";
import { ArgumentOutOfRangeException, InvalidOperationException } from "../../standard/exceptions/index.js";
import { ColorRGBA } from "./index.js";
import { ColorRGB } from "./index.js";
import { ColorHSL } from "./index.js";
import { ColorHSLA } from "./index.js";

import { TryOutput } from "../../standard/reflection/types.js";
import { BlendMode, BlendModes } from "./blending/index.js";
import { assertParams } from "../../validation/index.js";
import _ColorConversion from "./_color-conversion.js";

export abstract class Color extends Number {
    static fromRGBAHex(value: number): ColorRGBA {
        const { r, g, b, a } = _ColorConversion.convertToRGBA(value);
        return new ColorRGBA(r, g, b, a);
    }

    static fromRGBHex(value: number): ColorRGB {
        const { r, g, b } = _ColorConversion.convertToRGB(value);
        return new ColorRGB(r, g, b);
    }

    static fromShortenedRGBHex(value: number): ColorRGBA {
        const valueHex = (value & 0xF) * 0x11 | // Opacity channel
            ((value & 0xF0) >> 4) * 0x1100 | // Blue channel
            ((value & 0xF00) >> 8) * 0x110000 | // Green channel
            ((value & 0xF000) >> 12) * 0x11000000; // Red channel
        const { r, g, b, a } = _ColorConversion.convertToRGBA(valueHex);
        return new ColorRGBA(r, g, b, a);
    }

    static fromShortenedRGBAHex(value: number): ColorRGB {
        const valueHex = (value & 0xF) * 0x11 | // Blue channel
            ((value & 0xF0) >> 4) * 0x1100 | // Green channel
            ((value & 0xF00) >> 8) * 0x110000; // Red channel
        const { r, g, b } = _ColorConversion.convertToRGB(valueHex);
        return new ColorRGB(r, g, b);
    }

    static tryParse(value: string, output: TryOutput<Color>): boolean {
        return ColorRGB.tryParse(value, <any>output) || // Try parsing RGB color
            ColorRGBA.tryParse(value, <any>output) || // Try parsing RGBA color 
            ColorHSL.tryParse(value, <any>output) || // Try parsing HSL color
            ColorHSLA.tryParse(value, <any>output);  // Try parsing HSLA color
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
        const { r, g, b, a } = _ColorConversion.convertToRGBA(value);
        return new ColorRGBA(r, g, b, a);
    }

    toRGB(): ColorRGB {
        const value = Number(this);
        const { r, g, b } = _ColorConversion.convertToRGB(value);
        return new ColorRGB(r, g, b);
    }

    toHSL(): ColorHSL {
        const value = Number(this);
        const rgb = _ColorConversion.convertToRGB(value);
        const { h, s, l } = _ColorConversion.convertRGBtoHSL(rgb.r, rgb.g, rgb.b);
        return new ColorHSL(h, s, l);
    }

    toHSLA(): ColorHSLA {
        const value = Number(this);
        const rgba = _ColorConversion.convertToRGBA(value);
        const { h, s, l } = _ColorConversion.convertRGBtoHSL(rgba.r, rgba.g, rgba.b);
        return new ColorHSLA(h, s, l, rgba.a);
    }

    blend(foreground: Color, blendMode: BlendMode): Color {
        //assertParams(foreground, [Color]);
        //assertParams(blendMode, [BlendMode]);

        return blendMode.blend(this, foreground);
    }

    changeAlpha(newAlpha: number): ColorRGBA {
        assertParams({ newAlpha }, [Number]);

        const rgb = _ColorConversion.convertToRGB(Number(this));
        return new ColorRGBA(rgb.r, rgb.g, rgb.b, newAlpha);
    }

    lighten(amount: number = .5): Color {
        const foreground = WebColors.White.changeAlpha(amount);
        return this.blend(foreground, BlendModes.Normal);
    }

    darken(amount: number = .5): Color {
        const foreground = WebColors.Black.changeAlpha(amount);
        return this.blend(foreground, BlendModes.Normal);
    }
}
