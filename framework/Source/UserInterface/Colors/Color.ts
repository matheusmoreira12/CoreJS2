import ColorConversion from "./ColorConversion.js";
import { InvalidOperationException } from "../../Standard/Exceptions.js";
import { ColorRGBA } from "./ColorRGBA.js";
import { ColorRGB } from "./ColorRGB.js";
import { ColorHSL } from "./ColorHSL.js";
import { ColorHSLA } from "./ColorHSLA.js";

export abstract class Color extends Number {
    constructor(value: number) {
        if (new.target === Color)
            throw new InvalidOperationException("Invalid constructor.");
        super(value);
    }

    toRGBA(): ColorRGBA {
        const value = Number(this);
        const { r, g, b, a } = ColorConversion.convertToRGBA(value);
        return new ColorRGBA(r, g, b, a);
    }

    toRGB(): ColorRGB {
        const value = Number(this);
        const { r, g, b } = ColorConversion.convertToRGBA(value);
        return new ColorRGB(r, g, b);
    }

    toHSL(): ColorHSL {
        const value = Number(this);
        const rgb = ColorConversion.convertToRGBA(value);
        const { h, s, l } = ColorConversion.convertRGBtoHSL(rgb);
        return new ColorHSL(h, s, l);
    }

    toHSLA(): ColorHSLA {
        const value = Number(this);
        const { a, ...rgb } = ColorConversion.convertToRGBA(value);
        const { h, s, l } = ColorConversion.convertRGBtoHSL(rgb);
        return new ColorHSLA(h, s, l, a);
    }
}
