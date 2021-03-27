import { ArgumentOutOfRangeException } from "../../standard/exceptions/framework-exception.js";
import MathX from "../../standard/math-x.js";
import { TryOutput } from "../../standard/reflection/types.js";
import { assertParams } from "../../validation/index.js";

type ColorChannelMetadata = {
    parsedType: "percent" | "float" | null;
}

const $colorChannelMetadata = Symbol("colorChannelMetadata");

function setColorChannelMetadata(colorChannel: ColorChannel, metadata: ColorChannelMetadata): ColorChannel {
    ({ ...colorChannel[$colorChannelMetadata] } = { ...metadata })
    return colorChannel;
}

function getColorChannelMetadata(colorChannel: ColorChannel): ColorChannelMetadata {
    return colorChannel[$colorChannelMetadata];
}

export class ColorChannel extends Number {
    static coerceValue(value: any): ColorChannel {
        if (value instanceof ColorChannel)
            return value;
        return new ColorChannel(value);
    }

    static fromPercent(value: number): ColorChannel {
        assertParams({ value }, [ Number ]);

        return setColorChannelMetadata(new ColorChannel(value / 100 * 255), { parsedType: "percent" });
    }

    static fromFloatingPoint(value: number): ColorChannel {
        assertParams({ value }, [ Number ]);

        return setColorChannelMetadata(new ColorChannel(value * 255), { parsedType: "float" });
    }

    static tryParse(value: string, output: TryOutput<ColorChannel> = {}): boolean {
        assertParams({ value }, [ String ]);

        const PERCENT_PATTERN = /^[0-9]+%$/;
        const FLOAT_PATTERN = /^[0-9]+\.[0-9]+$/;
        const PATTERN = /^[0-9]+$/;

        if (value.match(PERCENT_PATTERN)) {
            output.result = this.fromPercent(Number(value.slice(0, -1)));
            return true;
        }
        if (value.match(FLOAT_PATTERN)) {
            output.result = this.fromFloatingPoint(Number(value));
            return true;
        }
        if (value.match(PATTERN)) {
            output.result = new ColorChannel(value);
            return true;
        }
        return false;
    }

    static parse(value: string) {
        const tryParseOutput: TryOutput<ColorChannel> = {};
        if (this.tryParse(value, tryParseOutput))
            return tryParseOutput.result!;

        throw new ArgumentOutOfRangeException("value");
    }

    [$colorChannelMetadata]: ColorChannelMetadata = {
        parsedType: null,
    }

    constructor(value: any) {
        super(MathX.limitToBounds(value, 0, 255));
    }

    toPercent(): number {
        return Number(this) / 255 * 100;
    }

    toFLoatingPoint(): number {
        return Number(this) / 255;
    }

    toString(): string {
        const meta = getColorChannelMetadata(this);
        if (meta.parsedType === "percent")
            return `${this.toPercent()}%`;
        if (meta.parsedType === "float")
            return `${this.toFLoatingPoint()}`;
        return `${Math.round(Number(this))}`;
    }
}
