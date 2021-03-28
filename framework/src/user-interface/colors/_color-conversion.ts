const _ColorConversion = {
    convertToRGBA(value: number): { r: number, g: number, b: number, a: number } {
        const byteR = (value >>> 24) & 0xFF,
            byteG = (value >>> 16) & 0xFF,
            byteB = (value >>> 8) & 0xFF,
            byteA = value & 0xFF;

        return {
            r: byteR,
            g: byteG,
            b: byteB,
            a: byteA
        };
    },

    convertToRGB(value: number): { r: number, g: number, b: number } {
        const { a, ...rgb } = this.convertToRGBA(value);
        return rgb;
    },

    convertFromRGBA(r: number, g: number, b: number, a: number): number {
        const byteR = Math.round(r),
            byteG = Math.round(g),
            byteB = Math.round(b),
            byteA = Math.round(a);

        return Number(BigInt(byteR) << 24n | BigInt(byteG) << 16n | BigInt(byteB) << 8n | BigInt(byteA));
    },

    convertFromRGB(r: number, g: number, b: number): number {
        return this.convertFromRGBA(r, g, b, 1);
    },

    convertRGBtoHSL(r: number, g: number, b: number): { h: number, s: number, l: number } {
        function getHue(): number {
            if (d != 0) {
                if (cmax == _r)
                    return 60 * (((_g - _b) / d) % 6);
                if (cmax == _g)
                    return 60 * ((_b - _r) / d + 2);
                if (cmax == _b)
                    return 60 * ((_r - _g) / d + 4);
            }
            return 0;
        }

        function getSaturation(): number {
            if (d != 0)
                return d / (1 - Math.abs(2 * l - 1));

            return 0;
        }

        const _r = r / 255,
            _g = g / 255,
            _b = b / 255;

        const cmax = Math.max(_r, _g, _b),
            cmin = Math.min(_r, _g, _b),
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
        
        const r = (_r + m) * 255,
            g = (_g + m) * 255,
            b = (_b + m) * 255;

        return { r,  g, b };
    }
};
export default _ColorConversion;