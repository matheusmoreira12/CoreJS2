﻿import { ArgumentOutOfRangeException } from "../../Standard/Exceptions/FrameworkException.js";
import { TryOutput } from "../../Standard/Reflection/Types.js";
import { assertParams } from "../../ValidationStandalone/ValidationStandalone.js";
import { ColorChannel } from "./ColorChannel.js";
import { ColorConversion } from "./index.js";
import { Color } from "./index.js";

export class ColorRGBA extends Color {
    constructor(r: ColorChannel, g: ColorChannel, b: ColorChannel, a: ColorChannel);
    constructor(r: number, g: number, b: number, a: number);
    constructor(r: ColorChannel | number, g: ColorChannel | number, b: ColorChannel | number, a: ColorChannel | number) {
        assertParams({ r }, [ColorChannel, Number]);
        assertParams({ g }, [ColorChannel, Number]);
        assertParams({ b }, [ColorChannel, Number]);
        assertParams({ a }, [ColorChannel, Number]);

        const value = ColorConversion.convertFromRGBA(Number(r), Number(g), Number(b), Number(a));
        super(value);

        this.__r = ColorChannel.coerceValue(r);
        this.__g = ColorChannel.coerceValue(g);
        this.__b = ColorChannel.coerceValue(b);
        this.__a = ColorChannel.coerceValue(a);
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

                const tryParseRedOutput: TryOutput<ColorChannel> = {},
                    tryParseGreenOutput: TryOutput<ColorChannel> = {},
                    tryParseBlueOutput: TryOutput<ColorChannel> = {},
                    tryParseAlphaOutput: TryOutput<ColorChannel> = {};

                if (ColorChannel.tryParse(redStr, tryParseRedOutput) && // Parse red channel
                    ColorChannel.tryParse(greenStr, tryParseGreenOutput) && // Parse green channel
                    ColorChannel.tryParse(blueStr, tryParseBlueOutput) && // Parse blue channel
                    ColorChannel.tryParse(alphaStr, tryParseAlphaOutput)) { // Parse opacity channel

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

    toString() {
        return `rgba(${this.r}, ${this.g}, ${this.b}, ${this.a})`;
    }

    public get r(): ColorChannel { return this.__r; }
    private __r: ColorChannel;

    public get g(): ColorChannel { return this.__g; }
    private __g: ColorChannel;

    public get b(): ColorChannel { return this.__b; }
    private __b: ColorChannel;

    public get a(): ColorChannel { return this.__a; }
    private __a: ColorChannel;
}
