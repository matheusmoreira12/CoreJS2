import ColorConversion from "./ColorConversion.js";
import { InvalidOperationException } from "../../Standard/Exceptions.js";
import { ColorRGBA } from "./ColorRGBA.js";
import { ColorRGB } from "./ColorRGB.js";

export abstract class Color extends Number {
    constructor(value: number) {
        if (new.target === Color)
            throw new InvalidOperationException("Invalid constructor.");
        super(value);
    }

    toRGBA() {
        const value = Number(this);
        const { r, g, b, a } = ColorConversion.convertToRGBA(value);
        return new ColorRGBA(r, g, b, a);
    }

    toRGB() {
        const value = Number(this);
        const { r, g, b } = ColorConversion.convertToRGBA(value);
        return new ColorRGB(r, g, b);
    }
}
