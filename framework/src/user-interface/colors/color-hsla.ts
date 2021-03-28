import { ArgumentOutOfRangeException } from "../../standard/exceptions/index.js";
import { MathX } from "../../standard/index.js";
import { TryOutput } from "../../standard/reflection/index.js";
import { assertParams } from "../../validation/index.js";
import { Color } from "./index.js";
import { ColorConversion } from "./index.js";
import { _Parsing } from "./_parsing.js";

export class ColorHSLA extends Color {
    static tryParse(value: string, output: TryOutput<ColorHSLA> = {}): boolean {
        assertParams({ value }, [String]);

        if (value.startsWith("hsla(") && value.endsWith(")")) {
            const channelsStr = value.slice(5, -1); // Remove name and braces
            const channelStrs = channelsStr.split(","); //Split into the individual channels
            if (channelStrs.length == 4) {
                const hueStr = channelStrs[0].trim(),
                    saturationStr = channelStrs[1].trim(),
                    luminosityStr = channelStrs[2].trim(),
                    alphaStr = channelStrs[3].trim();

                const tryParseHueOutput: TryOutput<number> = {},
                    tryParseSaturationOutput: TryOutput<number> = {},
                    tryParseLuminosityOutput: TryOutput<number> = {},
                    tryParseAlphaOutput: TryOutput<number> = {};
                if (_Parsing.tryParseHue(hueStr, tryParseHueOutput) && //Parse hue
                    _Parsing.tryParsePercentage(saturationStr, tryParseSaturationOutput) && //Parse saturation
                    _Parsing.tryParsePercentage(luminosityStr, tryParseLuminosityOutput) && //Parse luminosity
                    (_Parsing.tryParsePercentage(alphaStr, tryParseAlphaOutput) || _Parsing.tryParseNumber(alphaStr, tryParseAlphaOutput))) { //Parse alpha
                    output.result = new ColorHSLA(tryParseHueOutput.result!, tryParseSaturationOutput.result!, tryParseLuminosityOutput.result!, tryParseAlphaOutput.result!);
                    return true;
                }
            }
        }
        return false;
    }

    static parse(value: string) {
        const tryParseOutput: TryOutput<ColorHSLA> = {};
        if (this.tryParse(value, tryParseOutput))
            return tryParseOutput.result!;

        throw new ArgumentOutOfRangeException("value");
    }

    constructor(h: number, s: number, l: number, a: number) {
        const rgb = ColorConversion.convertHSLtoRGB(h, s, l);
        const value = ColorConversion.convertFromRGBA(rgb.r, rgb.g, rgb.b, a);
        super(value);

        this.__h = h % 360;
        this.__s = MathX.limitToBounds(s, 0, 1);
        this.__l = MathX.limitToBounds(l, 0, 1);
        this.__a = MathX.limitToBounds(a, 0, 1);
    }

    toString() {
        return `hsla(${this.h}deg, ${this.s * 100}%, ${this.l * 100}%, ${this.a})`;
    }

    get h(): number { return this.__h; }
    private __h: number;

    get s(): number { return this.__s; }
    private __s: number;

    get l(): number { return this.__l; }
    private __l: number;

    get a(): number { return this.__a; }
    private __a: number;
}