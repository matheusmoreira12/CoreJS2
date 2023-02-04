import { InvalidOperationException } from "../../standard/exceptions/index.js";
import { ColorRGBA } from "./index.js";
import { ColorRGB } from "./index.js";
import { ColorHSL } from "./index.js";
import { ColorHSLA } from "./index.js";

import { BlendMode } from "./blending/index.js";
import { assertParams } from "../../validation/index.js";
import _ColorConversion from "./_color-conversion.js";

export abstract class Color extends Number {
    static fromRGBAHex(value: number): ColorRGBA {
        const { r, g, b, a } = _ColorConversion.convertToRGBA(value);
        return new ColorRGBA(r, g, b, a);
    }

    static fromRGBHex(value: number): ColorRGB {
        const valueRGBA = (value << 8) | 0xFF;
        const { r, g, b } = _ColorConversion.convertToRGBA(valueRGBA);
        return new ColorRGB(r, g, b);
    }

    static fromShortenedRGBAHex(value: number): ColorRGBA {
        const valueFull = (value & 0xF) * 0x11 | // Opacity channel
            ((value & 0xF0) >> 4) * 0x1100 | // Blue channel
            ((value & 0xF00) >> 8) * 0x110000 | // Green channel
            ((value & 0xF000) >> 12) * 0x11000000; // Red channel
        const { r, g, b, a } = _ColorConversion.convertToRGBA(valueFull);
        return new ColorRGBA(r, g, b, a);
    }

    static fromShortenedRGBHex(value: number): ColorRGB {
        const valueFullRGBA = 0xFF | // Opacity channel
            (value & 0xF) * 0x1100 | // Blue channel
            ((value & 0xF0) >> 4) * 0x110000 | // Green channel
            ((value & 0xF00) >> 8) * 0x11000000; // Red channel
        const { r, g, b } = _ColorConversion.convertToRGBA(valueFullRGBA);
        return new ColorRGB(r, g, b);
    }

    constructor(value: number) {
        if (new.target === Color)
            throw new InvalidOperationException("Invalid constructor.");

        super(value);
    }

    toRGBA(): ColorRGBA {
        const { r, g, b, a } = _ColorConversion.convertToRGBA(Number(this));
        return new ColorRGBA(r, g, b, a);
    }

    toRGB(): ColorRGB {
        const { r, g, b } = _ColorConversion.convertToRGBA(Number(this));
        return new ColorRGB(r, g, b);
    }

    toHSL(): ColorHSL {
        const { r, g, b } = _ColorConversion.convertToRGBA(Number(this));
        const { h, s, l } = _ColorConversion.convertRGBtoHSL(r, g, b);
        return new ColorHSL(h, s, l);
    }

    toHSLA(): ColorHSLA {
        const value = Number(this);
        const rgba = _ColorConversion.convertToRGBA(value);
        const { h, s, l } = _ColorConversion.convertRGBtoHSL(rgba.r, rgba.g, rgba.b);
        return new ColorHSLA(h, s, l, rgba.a);
    }

    blend(foreground: Color, blendMode: BlendMode): Color {
        assertParams(foreground, [Color]);
        assertParams(blendMode, [BlendMode]);

        return blendMode.blend(this, foreground);
    }

    changeAlpha(newAlpha: number): ColorRGBA {
        assertParams({ newAlpha }, [Number]);

        const { r, g, b } = _ColorConversion.convertToRGBA(Number(this));
        return new ColorRGBA(r, g, b, newAlpha);
    }

    lighten(amount: number = .5): ColorRGBA {
        const { r, g, b, a } = _ColorConversion.convertToRGBA(Number(this));
        return new ColorRGBA(r * (1 - amount) + amount,
            g * (1 - amount) + amount,
            b * (1 - amount) + amount,
            a);
    }

    darken(amount: number = .5): ColorRGBA {
        const { r, g, b, a } = _ColorConversion.convertToRGBA(Number(this));
        return new ColorRGBA(r * (1 - amount),
            g * (1 - amount),
            b * (1 - amount),
            a);
    }
}
