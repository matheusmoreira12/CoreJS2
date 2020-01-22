declare const ColorConversion: {
    convertToRGBA(value: number): {
        r: number;
        g: number;
        b: number;
        a: number;
    };
    convertToRGB(value: number): {
        r: number;
        g: number;
        b: number;
    };
    convertFromRGBA(r: number, g: number, b: number, a: number): number;
    convertFromRGB(r: number, g: number, b: number): number;
    convertRGBtoHSL(r: number, g: number, b: number): {
        h: number;
        s: number;
        l: number;
    };
    convertHSLtoRGB(h: number, s: number, l: number): {
        r: number;
        g: number;
        b: number;
    };
};
export default ColorConversion;
