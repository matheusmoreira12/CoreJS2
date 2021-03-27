import { ArgumentOutOfRangeException } from "../../standard/exceptions/framework-exception.js";
import { TryOutput } from "../../standard/reflection/types.js";
import { assertParams } from "../../validation-standalone/validation-standalone.js";
import { ColorConversion } from "./index.js";
import { Color } from "./index.js";

export class ColorRGBA extends Color {
    constructor(r: number, g: number, b: number, a: number) {
        assertParams({ r, g, b, a }, [Number]);

        const value = ColorConversion.convertFromRGBA(Number(r), Number(g), Number(b), Number(a));
        super(value);

        this.__r = r;
        this.__g = g;
        this.__b = b;
        this.__a = a;
    }

    static tryParse(value: string, output: TryOutput<ColorRGBA> = {}): boolean {
        assertParams({ value }, [String]);

        if (value.startsWith("rgb(") && value.endsWith(")")) {
            const channelsStr = value.slice(4, -1); // Remove name and braces
            const channelStrs = channelsStr.split(","); //Split into the individual channels
            if (channelStrs.length == 4) {
                const redStr = channelStrs[0].trim(),
                    greenStr = channelStrs[1].trim(),
                    blueStr = channelStrs[2].trim(),
                    alphaStr = channelStrs[3].trim();

                output.result = new ColorRGBA(Number(redStr), Number(greenStr), Number(blueStr), Number(alphaStr));
                return true;
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
