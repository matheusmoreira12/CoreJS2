import { ArgumentOutOfRangeException } from "../../standard/exceptions/index.js";
import { TryOutput } from "../../standard/reflection/index.js";
import { assertParams } from "../../validation/index.js";
import { ColorConversion } from "./index.js";
import { Color } from "./index.js";
import { _parsing } from "./_parsing.js";

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
                if (_parsing.tryParseNumber(redStr, tryParseRedOutput) && // Parse red
                    _parsing.tryParseNumber(greenStr, tryParseGreenOutput) && // Parse green
                    _parsing.tryParseNumber(blueStr, tryParseBlueOutput)) { // Parse blue
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
        this.__r = r;
        this.__g = g;
        this.__b = b;
    }

    toString() {
        return `rgb(${this.r * 100}%, ${this.g * 100}%, ${this.b * 100}%)`;
    }

    public get r(): number { return this.__r; }
    private __r: number;

    public get g(): number { return this.__g; }
    private __g: number;

    public get b(): number { return this.__b; }
    private __b: number;
}
