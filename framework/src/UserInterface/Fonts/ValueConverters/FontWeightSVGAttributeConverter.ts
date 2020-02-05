import { FontWeight } from "../index";

export class FontWeightSVGAttributeConverter {
    convert(value: number | null): string | null {
        if (value === null)
            return null;
        else
            switch (value) {
                case FontWeight.Normal:
                    return "normal";
                case FontWeight.Bold:
                    return "bold";
                case FontWeight.Bolder:
                    return "bolder";
                case FontWeight.Lighter:
                    return "lighter";
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
                    return FontWeight.Normal;
                case "bold":
                    return FontWeight.Bold;
                case "bolder":
                    return FontWeight.Bolder;
                case "lighter":
                    return FontWeight.Lighter;
                default:
                    return null;
            }
    }
};