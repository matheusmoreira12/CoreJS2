import { ColorConversion } from "./index";
import { InvalidOperationException } from "../../Standard/Exceptions";
import { ColorRGBA } from "./index";
import { ColorRGB } from "./index";
import { ColorHSL } from "./index";
import { ColorHSLA } from "./index";

import { Blending } from "./index";

export abstract class Color extends Number {
    static fromRGBAHex(value: number): ColorRGBA {
        const { r, g, b, a } = ColorConversion.convertToRGBA(value);
        return new ColorRGBA(r, g, b, a);
    }

    static fromRGBHex(value: number): ColorRGB {
        const { r, g, b } = ColorConversion.convertToRGB(value);
        return new ColorRGB(r, g, b);
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
