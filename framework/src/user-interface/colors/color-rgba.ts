import { ArgumentOutOfRangeException } from "../../standard/exceptions/framework-exception.js";
import { MathX } from "../../standard/index.js";
import { TryOutput } from "../../standard/reflection/types.js";
import { assertParams } from "../../validation/index.js";
import { ColorConversion } from "./index.js";
import { Color } from "./index.js";
import { _Parsing } from "./_parsing.js";

export class ColorRGBA extends Color {
    static tryParse(value: string, output: TryOutput<ColorRGBA> = {}): boolean {
        assertParams({ value }, [String]);

        if (value.startsWith("rgba(") && value.endsWith(")")) {
            const channelsStr = value.slice(5, -1); // Remove name and braces
            const channelStrs = channelsStr.split(","); //Split into the individual channels
            if (channelStrs.length == 4) {
                const redStr = channelStrs[0].trim(),
                    greenStr = channelStrs[1].trim(),
                    blueStr = channelStrs[2].trim(),
                    alphaStr = channelStrs[3].trim();

                const tryParseRedOutput: TryOutput<number> = {},
                    tryParseGreenOutput: TryOutput<number> = {},
                    tryParseBlueOutput: TryOutput<number> = {},
                    tryParseAlphaOutput: TryOutput<number> = {};
                if (_Parsing.tryParseNumber(redStr, tryParseRedOutput) && // Parse red
                    _Parsing.tryParseNumber(greenStr, tryParseGreenOutput) && // Parse green
                    _Parsing.tryParseNumber(blueStr, tryParseBlueOutput) && // Parse blue
                    _Parsing.tryParsePercentage(alphaStr, tryParseAlphaOutput) || _Parsing.tryParseNumber(alphaStr, tryParseAlphaOutput)) { // Parse alpha
                    output.result = new ColorRGBA(tryParseRedOutput.result!, tryParseGreenOutput.result!, tryParseBlueOutput.result!, tryParseAlphaOutput.result!);
                    return true;
                }
            }
        }
        return false;
    }

    static parse(value: string) {
        const tryParseOutput: TryOutput<ColorRGBA> = {};
        if (this.tryParse(value, tryParseOutput))
            return tryParseOutput.result!;

        throw new ArgumentOutOfRangeException("value");
    }

    constructor(r: number, g: number, b: number, a: number) {
        assertParams({ r, g, b, a }, [Number]);

        const value = ColorConversion.convertFromRGBA(r, g, b, a);
        super(value);

        this.__r = MathX.limitToBounds(Math.round(r), 0, 255);
        this.__g = MathX.limitToBounds(Math.round(g), 0, 255);
        this.__b = MathX.limitToBounds(Math.round(b), 0, 255);
        this.__a = MathX.limitToBounds(a, 0, 1);
    }

    toString() {
        return `rgba(${this.r}, ${this.g}, ${this.b}, ${this.a})`;
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
