import MathX from "../../Standard/MathX";

const NIBBLE_MASK = 0xFF,
    BITS_PER_NIBBLE = 4;

const ColorUtils = {
    convertColorToRGB(color: number) {
        return {
            r: (color >> (BITS_PER_NIBBLE * 4)) & NIBBLE_MASK,
            g: (color >> (BITS_PER_NIBBLE * 2)) & NIBBLE_MASK,
            b: color & NIBBLE_MASK
        }
    },

    convertRGBtoColor({ r, g, b }: { r: number, g: number, b: number }) {
        return r << (BITS_PER_NIBBLE * 4) | g << (BITS_PER_NIBBLE * 2) | b;
    },

    colorToString(color: number) {
        return `#${color.toString(16).padStart(6, "0")}`;
    },

    stringToColor(value: string): number | null {
        if (!value.startsWith("#"))
            return null;

        return Number.parseInt(value.slice(2), 16);
    },

    getGradient(value: number, min: number, max: number, ...colors: number[]) {
        value = MathX.limitToBounds(value, min, max);

        const relValue = value - min,
            relTotal = max - min,
            step = relTotal / colors.length;

        let index0 = Math.trunc(relValue / step),
            index1 = Math.min(Math.trunc(relValue / step + 1), colors.length - 1);

        const intVal = (relValue / step) % 1;

        const color0 = colors[index0], { r: r0, g: g0, b: b0 } = this.convertColorToRGB(color0),
            color1 = colors[index1], { r: r1, g: g1, b: b1 } = this.convertColorToRGB(color1);

        const r = Math.round((1 - intVal) * r0 + intVal * r1),
            g = Math.round((1 - intVal) * g0 + intVal * g1),
            b = Math.round((1 - intVal) * b0 + intVal * b1);

        return this.convertRGBtoColor({ r, g, b });
    }
}

export default ColorUtils;