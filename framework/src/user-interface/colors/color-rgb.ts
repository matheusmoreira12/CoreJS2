import { ArgumentOutOfRangeException } from "../../standard/exceptions/index.js";
import { MathX } from "../../standard/math-x.js";
import { TryOutput } from "../../standard/reflection/index.js";
import { assertParams } from "../../validation/index.js";
import { ColorConversion } from "./index.js";
import { Color } from "./index.js";
import { _Parsing } from "./_parsing.js";

export class ColorRGB extends Color {
    static tryParse(value: string, output: TryOutput<ColorRGB> = {}): boolean {
        assertParams({ value }, [String]);

        if (value.startsWith("rgb(") && value.endsWith(")")) {
            const channelsStr = value.slice(4, -1); // Remove name and braces
            const channelStrs = channelsStr.split(","); //Split into the individual channels
            if (channelStrs.length == 4) {
                const redStr = channelStrs[0].trim(),
                    greenStr = channelStrs[1].trim(),
                    blueStr = channelStrs[2].trim();
                
                const tryParseRedOutput: TryOutput<number> = {},
                    tryParseGreenOutput: TryOutput<number> = {},
                    tryParseBlueOutput: TryOutput<number> = {};
                if (_Parsing.tryParseNumber(redStr, tryParseRedOutput) && // Parse red
                    _Parsing.tryParseNumber(greenStr, tryParseGreenOutput) && // Parse green
                    _Parsing.tryParseNumber(blueStr, tryParseBlueOutput)) { // Parse blue
                    output.result = new ColorRGB(tryParseRedOutput.result!, tryParseGreenOutput.result!, tryParseBlueOutput.result!);
                    return true;
                }
            }
        }
        return false;
    }

    static parse(value: string) {
        const tryParseOutput: TryOutput<ColorRGB> = {};
        if (this.tryParse(value, tryParseOutput))
            return tryParseOutput.result!;

        throw new ArgumentOutOfRangeException("value");
    }

    constructor(r: number, g: number, b: number) {
        const value = ColorConversion.convertFromRGBA(r, g, b, 1);
        super(value);
        this.__r = MathX.limitToBounds(Math.round(r), 0, 255);
        this.__g = MathX.limitToBounds(Math.round(g), 0, 255);
        this.__b = MathX.limitToBounds(Math.round(b), 0, 255);
    }

    toString() {
        return `rgb(${this.r}, ${this.g}, ${this.b})`;
    }

    public get r(): number { return this.__r; }
    private __r: number;

    public get g(): number { return this.__g; }
    private __g: number;

    public get b(): number { return this.__b; }
    private __b: number;
}
