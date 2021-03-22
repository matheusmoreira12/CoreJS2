import { ArgumentOutOfRangeException } from "../../Standard/Exceptions/FrameworkException.js";
import { TryOutput } from "../../Standard/Reflection/Types.js";
import { assertParams } from "../../ValidationStandalone/ValidationStandalone.js";
import { ColorChannel } from "./ColorChannel.js";
import { ColorHSL } from "./ColorHSL.js";
import { ColorRGB } from "./ColorRGB.js";
import { ColorConversion } from "./index.js";
import { Color } from "./index.js";

export class ColorRGBA extends Color {
    constructor(r: number, g: number, b: number, a: number) {
        const value = ColorConversion.convertFromRGBA(r, g, b, a);
        super(value);

        this.__r = new ColorChannel(r);
        this.__g = new ColorChannel(g);
        this.__b = new ColorChannel(b);
        this.__a = new ColorChannel(a);
    }

    static tryParse(value: string, output: TryOutput<ColorRGBA>): boolean {
        assertParams({ value }, [ String ]);

        
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
