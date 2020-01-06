import MathX from "../../Standard/MathX";
import { Color } from "./Color";

const ColorUtils = {
    colorToString(color: Color) {
        return `#${color.toString(16).padStart(6, "0")}`;
    },

    stringToColor(value: string): number | null {
        if (!value.startsWith("#"))
            return null;

        return Number.parseInt(value.slice(2), 16);
    },

    getGradient(value: number, min: number, max: number, ...colors: number[]): number {
        value = MathX.limitToBounds(value, min, max);

        const relValue = value - min,
            relTotal = max - min,
            step = relTotal / colors.length;

        const index0 = Math.trunc(relValue / step),
            index1 = Math.min(Math.trunc(relValue / step + 1), colors.length - 1);

        const color0 = colors[index0],
            color1 = colors[index1];

        const factor = (relValue / step) % 1;

        return this.blend(color0, color1, factor);
    }
}

export default ColorUtils;