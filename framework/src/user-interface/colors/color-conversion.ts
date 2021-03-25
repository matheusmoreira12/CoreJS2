import MathX from "../../Standard/MathX.js";

const ColorConversion = {
    convertToRGBA(value: number): { r: number, g: number, b: number, a: number } {
        const byteR = (value >>> 24) & 0xFF,
            byteG = (value >>> 16) & 0xFF,
            byteB = (value >>> 8) & 0xFF,
            byteA = value & 0xFF;

        return {
            r: byteR / 255,
            g: byteG / 255,
            b: byteB / 255,
            a: byteA / 255
        };
    },

    convertToRGB(value: number): { r: number, g: number, b: number } {
        const { a, ...rgb } = this.convertToRGBA(value);
        return rgb;
    },

    convertFromRGBA(r: number, g: number, b: number, a: number): number {
        r = MathX.limitToBounds(r, 0, 1);
        g = MathX.limitToBounds(g, 0, 1);
        b = MathX.limitToBounds(b, 0, 1);
        a = MathX.limitToBounds(a, 0, 1);

        const byteR = Math.round(r * 255),
            byteG = Math.round(g * 255),
            byteB = Math.round(b * 255),
            byteA = Math.round(a * 255);

        return Number(BigInt(byteR) << 24n | BigInt(byteG) << 16n | BigInt(byteB) << 8n | BigInt(byteA));
    },

    convertFromRGB(r: number, g: number, b: number): number {
        return this.convertFromRGBA(r, g, b, 1);
    },

    convertRGBtoHSL(r: number, g: number, b: number): { h: number, s: number, l: number } {
        function getHue(): number {
            if (d != 0) {
                if (cmax == r)
                    return 60 * (((g - b) / d) % 6);
                if (cmax == g)
                    return 60 * ((b - r) / d + 2);
                if (cmax == b)
                    return 60 * ((r - g) / d + 4);
            }
            return 0;
        }

        function getSaturation(): number {
            if (d != 0)
                return d / (1 - Math.abs(2 * l - 1));

            return 0;
        }

        const cmax = Math.max(r, g, b),
            cmin = Math.min(r, g, b),
            d = cmax - cmin,
            h = getHue(),
            l = (cmax + cmin) / 2,
            s = getSaturation();

        return { h, s, l };
    },

    convertHSLtoRGB(h: number, s: number, l: number): { r: number, g: number, b: number } {
        function getRGB(): [number, number, number] {
            if (h >= 300)
                return [c, 0, x];
            if (h >= 240)
                return [x, 0, c];
            if (h >= 180)
                return [0, x, c];
            if (h >= 120)
                return [0, c, x];
            if (h >= 60)
                return [x, c, 0];

            return [c, x, 0];
        }

        const c = (1 - Math.abs(2 * l - 1)) * s,
            x = c * (1 - Math.abs((h / 60) % 2 - 1)),
            m = l - c / 2;

        const [_r, _g, _b] = getRGB();

        return { r: (_r + m), g: (_g + m), b: (_b + m) };
    }
};
export default ColorConversion;