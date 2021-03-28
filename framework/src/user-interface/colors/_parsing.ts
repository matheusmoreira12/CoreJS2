import { TryOutput } from "../../standard/reflection/index.js";

export const _Parsing = {
    tryParseHue(value: string, output: TryOutput<number> = {}): boolean {
        if (value.endsWith("deg")) {
            value = value.slice(0, -3);
            output.result = Number(value);
            return true;
        }
        return false;
    },

    tryParsePercentage(value: string, output: TryOutput<number> = {}): boolean {
        if (value.endsWith("%")) {
            value = value.slice(0, -1);

            const tryParseNumberOutput: TryOutput<number> = {};
            if (this.tryParseNumber(value, tryParseNumberOutput)) {
                output.result = tryParseNumberOutput.result! / 100;
                return true;
            }
        }
        return false;
    },

    tryParseNumber(value: string, output: TryOutput<number> = {}): boolean {
        const valueNbr = Number(value);
        if (valueNbr !== NaN) {
            output.result = valueNbr;
            return true;
        }
        return false;
    }
}