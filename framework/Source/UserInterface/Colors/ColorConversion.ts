import MathX from "../../Standard/MathX.js";

const BYTE_MASK = 0xFF,
    BITS_PER_NIBBLE = 4;

const ColorConversion = {
    convertToRGBA(value: number) {
        const byteR = (value >>> (BITS_PER_NIBBLE * 6)) & BYTE_MASK,
            byteG = (value >>> (BITS_PER_NIBBLE * 4)) & BYTE_MASK,
            byteB = (value >>> (BITS_PER_NIBBLE * 2)) & BYTE_MASK,
            byteA = value & BYTE_MASK;

        return {
            r: byteR / 255,
            g: byteG / 255,
            b: byteB / 255,
            a: byteA / 255
        };
    },

    convertFromRGBA({ r, g, b, a }: { r: number, g: number, b: number, a: number }): number {
        r = MathX.limitToBounds(r, 0, 1);
        g = MathX.limitToBounds(g, 0, 1);
        b = MathX.limitToBounds(b, 0, 1);
        a = MathX.limitToBounds(a, 0, 1);

        const byteR = Math.round(r * 255),
            byteG = Math.round(g * 255),
            byteB = Math.round(b * 255),
            byteA = Math.round(a * 255);

        return byteR << (BITS_PER_NIBBLE * 6) | byteG << (BITS_PER_NIBBLE * 4) | byteB << (BITS_PER_NIBBLE * 2) | byteA;
    }
};
export default ColorConversion;