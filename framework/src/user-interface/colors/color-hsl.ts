import { ArgumentOutOfRangeException, FormatException } from "../../standard/exceptions/index.js";
import { MathX } from "../../standard/index.js";
import { TryOutput } from "../../standard/reflection/index.js";
import { assertParams } from "../../validation/index.js";
import { Color } from "./index.js";
import { ColorConversion } from "./index.js";
import { _Parsing } from "./_parsing.js";

export class ColorHSL extends Color {
    static tryParse(value: string, output: TryOutput<ColorHSL> = {}): boolean {
        assertParams({ value }, [String]);

        if (value.startsWith("hsl(") && value.endsWith(")")) {
            const channelsStr = value.slice(4, -1); // Remove name and braces
            const channelStrs = channelsStr.split(","); //Split into the individual channels
            if (channelStrs.length == 4) {
                const hueStr = channelStrs[0].trim(),
                    saturationStr = channelStrs[1].trim(),
                    luminosityStr = channelStrs[2].trim();
                
                const tryParseHueOutput: TryOutput<number> = {},
                    tryParseSaturationOutput: TryOutput<number> = {},
                    tryParseLuminosityOutput: TryOutput<number> = {};
                if (_Parsing.tryParseHue(hueStr) && // Parse hue
                    _Parsing.tryParsePercentage(saturationStr) && // Parse saturation
                    _Parsing.tryParsePercentage(luminosityStr)){ // Parse luminosity
                    output.result = new ColorHSL(tryParseHueOutput.result!, tryParseSaturationOutput.result!, tryParseLuminosityOutput.result!);
                    return true;
                }
            }
        }
        return false;
    }

    static parse(value: string) {
        const tryParseOutput: TryOutput<ColorHSL> = {};
        if (this.tryParse(value, tryParseOutput))
            return tryParseOutput.result!;

        throw new ArgumentOutOfRangeException("value");
    }

    constructor(h: number, s: number, l: number) {
        const rgb = ColorConversion.convertHSLtoRGB(h, s, l);
        const value = ColorConversion.convertFromRGBA(rgb.r, rgb.g, rgb.b, 1);
        super(value);

        this.__h = h % 360;
        this.__s = MathX.limitToBounds(s, 0, 1);
        this.__l = MathX.limitToBounds(l, 0, 1);
    }

    toString() {
        return `hsl(${this.h}deg, ${this.s * 100}%, ${this.l * 100}%)`;
    }

    get h(): number { return this.__h; }
    private __h: number;

    get s(): number { return this.__s; }
    private __s: number;

    get l(): number { return this.__l; }
    private __l: number;
}