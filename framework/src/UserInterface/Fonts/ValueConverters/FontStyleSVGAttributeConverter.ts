import { FontStyle } from "../index";

export class FontStyleSVGAttributeConverter {
    convert(value: number | null): string | null {
        if (value === null)
            return null;
        else
            switch (value) {
                case FontStyle.Normal:
                    return "normal";
                case FontStyle.Italic:
                    return "italic"
                case FontStyle.Oblique:
                    return "oblique";
                default:
                    return null;
            }
    }

    convertBack(value: string | null): number | null {
        if (value === null)
            return null;
        else
            switch (value) {
                case "normal":
                    return FontStyle.Normal;
                case "italic":
                    return FontStyle.Italic;
                case "oblique":
                    return FontStyle.Oblique;
                default:
                    return null;
            }
    }
};